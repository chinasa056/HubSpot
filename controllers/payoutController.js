const axios = require("axios");
const Host = require("../models/host");
const Payment = require("../models/payment");
const otpgenerator = require("otp-generator");
const { payoutSuccess } = require("../utils/mailTemplate");
const { sendMail } = require("../middleware/nodemailer");
const formattedDate = new Date().toLocaleString();
const korapaySecret = process.env.KORAPAY_SECRET_KEY;
const payoutUrl =
  "https://api.korapay.com/merchant/api/v1/transactions/disburse";

exports.initiateHostPayout = async (req, res) => {
  try {
    const reference = otpgenerator.generate(10, {
      lowerCaseAlphabets: true,
      upperCaseAlphabets: true,
      specialChars: false,
    });

    const { userId: hostId } = req.user;
    const host = await Host.findByPk(hostId);

    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }

    if (host.currentBalance <= 0) {
      return res
        .status(400)
        .json({ message: "Insufficient balance for payout" });
    }

    const payoutAmount = host.currentBalance;

    const payoutRequest = {
      reference,
      destination: {
        type: "bank_account",
        amount: payoutAmount,
        currency: "NGN",
        narration: "Payout for booking earnings",
        bank_account: {
          bank: "044",
          account: host.bankAccountNumber.toString(),
        },
        customer: {
          name: host.fullName,
          email: host.email,
        },
      },
    };

    const response = await axios.post(payoutUrl, payoutRequest, {
      headers: { Authorization: `Bearer ${korapaySecret}` },
    });

    // console.log("full response:", response);
    console.log("KoraPay response:", response.data);
    const { data } = response.data;

    if (data?.status && data?.status === "processing") {
      await Payment.create({
        hostId: host.id,
        hostName: host.fullName,
        email: host.email,
        amount: payoutAmount,
        reference,
        status: "processing",
        paynemtDate: formattedDate,
      });

      return res.status(200).json({
        message: "Payout request sent successfully. Awaiting confirmation.",
        reference,
        amount: payoutAmount,
      });
    } else {
      await Payment.create({
        hostId: host.id,
        hostName: host.fullName,
        email: host.email,
        amount: 0,
        reference,
        status: "failed",
        paymentDate: formattedDate,
      });

      return res
        .status(500)
        .json({ message: `KoraPay rejected payout: ${message}` });
    }
  } catch (error) {
    console.error("Payout error:", error.message);
    return res.status(500).json({
      message: "Error initiating payout",
      error: error.message,
    });
  }
};

exports.korapayWebhook = async (req, res) => {
  try {
    const { event, data } = req.body;

    if (event === "transfer.success") {
      const payment = await Payment.findOne({
        where: { reference: data.reference },
      });
      if (!payment) {
        return res.status(404).json({ message: "Payment record not found" });
      }

      const host = await Host.findByPk(payment.hostId);
      if (!host) {
        return res.status(404).json({ message: "Host not found" });
      }

      if (payment.status !== "success") {
        payment.status = "success";

        host.currentBalance -= data.amount;

        const payoutDetails = {
          reference: data.reference,
          amount: data.amount,
          fee: data.fee,
          status: data.status,
        };

        const firstName = host.fullName;

        const payoutSuccessHtml = payoutSuccess(firstName, payoutDetails);

        const successMailOptions = {
          email: host.email,
          subject: "Withdrawal Successful",
          html: payoutSuccessHtml,
        };

        await sendMail(successMailOptions);
        await host.save();
        await payment.save();

        console.log(
          `Payout successful. Host balance updated. Ref: ${data.reference}`
        );
      } else {
        console.log(
          `Payout already marked successful. Skipping. Ref: ${data.reference}`
        );
      }

      res.status(200);
    } else if (event === "transfer.failed") {
      const payment = await Payment.findOne({
        where: { reference: data.reference },
      });
      if (!payment) {
        return res.status(404).json({ message: "Payment record not found" });
      }

      if (payment.status !== "failed") {
        payment.status = "failed";
        await payment.save();

        console.log(`Payout failed. Ref: ${data.reference}`);
      } else {
        console.log(
          `ℹPayout already marked failed. Skipping. Ref: ${data.reference}`
        );
      }
    } else {
      return res.status(200).json({ message: "Event ignored" });
    }

    return res.status(200).json({ message: "Webhook processed successfully" });
  } catch (err) {
    console.error("Error processing KoraPay webhook:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
