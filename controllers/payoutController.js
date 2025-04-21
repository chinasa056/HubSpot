const axios = require("axios");
const Host = require("../models/host");
const Payment = require("../models/payment");
const otpgenerator = require("otp-generator");
const korapaySecret = process.env.KORAPAY_SECRET_KEY;
const formattedDate = new Date().toLocaleString();
const payoutUrl = "https://api.korapay.com/merchant/api/v1/transactions/disburse"

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
        };

        // console.log(host);
        

        if (host.currentBalance <= 0) {
            return res.status(400).json({ message: "Insufficient balance for payout" });
        }

        // const payoutRequest = {
        //     reference: reference,
        //     destination: {
        //         type: "bank_account",
        //         amount: host.currentBalance,
        //         currency: "NGN", 
        //         narration: "Payout for booking earnings",
        //         bank_account: {
        //             bank: "044", 
        //             account: host.bankAccountNumber,
        //         },
        //         customer: {
        //             name: host.fullName,
        //             email: host.email,
        //         },
        //     },
        // };

        const payoutRequest = {
            reference: reference,
            destination: {
              type: "bank_account",
              amount: host.currentBalance * 100, // Convert to kobo
              currency: "NGN",
              narration: "Payout for booking earnings",
              bank_account: {
                bank: "044",
                account: host.bankAccountNumber.toString(), // just in case it's a number
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

        const { status, message, data } = response.data;
        console.log("response data", response.data);
        

        // if (status === "success") {
        //     host.currentBalance -= data.amount; 
        //     await host.save();

            // await Payment.create({
            //     hostId: host.id,
            //     email: host.email,
            //     amount: data.amount,
            //     reference: reference,
            //     status: "active",
            //     paymentDate: formattedDate
            // });

            // Respond to the client
        //     res.status(200).json({
        //         message: "Payout initiated successfully",
        //         reference: reference,
        //         amount: data.amount,
        //         fee: data.fee,
        //         status: data.status,
        //     });
        // } else {
        //     // Record the payout failure in the Payment model
        //     // await Payment.create({
        //     //     hostId: host.id,
        //     //     email: host.email,
        //     //     amount: 0, // No payout as the request failed
        //     //     reference: reference,
        //     //     status: "failed",
        //     //     paymentDate: new Date(),
        //     // });

        //     // Respond with failure message
        //     res.status(500).json({ message: `Payout failed: ${message}` });
        // }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error initiating payout", error: error.message });
    }
};
