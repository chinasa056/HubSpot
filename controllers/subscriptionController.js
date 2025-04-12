const Host = require("../models/host");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const { sendMail } = require("../middleware/nodemailer");
const ref = otpGenerator.generate(10, {
  lowerCaseAlphabets: true,
  upperCaseAlphabets: true,
  specialChars: false,
});
const korapaySecret = process.env.KORAPAY_SECRET_KEY;
const currentDate = new Date()


exports.initializeStandardSubscription = async (req, res) => {
  try {
    const { userId } = req.user;

    const host = await Host.findByPk(userId);
    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    };

    if (host.subscription === "Standard" && host.subscriptionExpired > currentDate) {
      return res.status(400).json({
        message: "You curently have an active Standard subscription, Would you like to upgrade to Premium?"
      })
    };

    const paymentDetails = {
      amount: 10000,
      currency: "NGN",
      reference: ref,
      customer: { email: host.email, name: host.fullName },
    };


    const response = await axios.post(
      "https://api.korapay.com/merchant/api/v1/charges/initialize",
      paymentDetails,
      {
        headers: { Authorization: `Bearer ${korapaySecret}` },
      }
    );

    const { data } = response.data;


    res.status(200).json({
      message: "Subscription initialized successfully",
      data: {
        reference: data.reference,
        checkout_url: data.checkout_url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error subscribing", data: error.message });
  }
};

exports.verifyStandardSubscription = async (req, res) => {
  try {
    const { reference } = req.query;

    const response = await axios.get(
      `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${korapaySecret}`,
        },
      }
    );

    console.log("response", response.data.data.customer.email);

    const { data } = response;

    if (data?.status && data.data?.status === "success") {
      const email = data.data.customer.email
      const host = await Host.findOne({ where: { email: email } });
      if (!host) {
        return res.status(404).json({
          message: "Subscription failed: Host not found"
        })
      };
      host.subscription = "Standard"
      const expiryDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      host.subscriptionExpired = expiryDate;
      await host.save()
    };
    res.status(200).json({
      message: "Subscription verified successfully"
    })
  } catch (error) {
    console.error(`Error verifying subscription: ${error.message}`);
    res.status(500).json({
      message: "Error verifying subscription",
    });
  }
};

exports.checkSubscriptionStatus = async (req, res) => {
  try {
    const activeSubscriptions = await Subscription.findAll({
      order: [['endDate', 'DESC']],
    });

    if (activeSubscriptions.length === 0) {
      console.log("No current subscriptions found");
      return res.status(200).json({ message: "No subscriptions found" });
    }

    // console.log('Active: ',activeSubscriptions)
    const currentDate = new Date();

    for (const subscription of activeSubscriptions) {
      const hostId = subscription.hostId;
      console.log('Subscription: ', subscription)

      if (currentDate > new Date(subscription.endDate)) {
        subscription.status = "expired";
        await subscription.save();

        const host = await Host.findByPk(hostId);
        if (!host) {
          console.error(`Host not found for ID: ${hostId}`);
          continue;
        }
        console.log("host:", host.dataValues);

        const link = `${req.protocol}://${req.get("host")}/api/v1/renew-subscription`;
        const firstName = host.fullName.split(' ')[0];
        const daysSinceExpiry = Math.ceil((currentDate - new Date(subscription.endDate)) / (1000 * 60 * 60 * 24));

        const mailOptions = {
          email: host.email,
          subject: "Your Subscription Has Expired",
          html: expirationReminder(link, firstName, daysSinceExpiry),
        };

        await sendMail(mailOptions);

        // continue;

      } else {
        console.log(`Subscription ID ${subscription.id} is still active until ${subscription.endDate}`);
        continue;
      }
    }

    res.status(200).json({
      message: "Subscription expired, email reminder sent"
    });

  } catch (error) {
    console.error("Error checking subscription status:", error);
    res.status(500).json({
      message: "Error fetching subscription details",
      data: error.message,
    });
  }
};

// PREMIUM SUBSCRIPTION

exports.initializePremiumSubscription = async (req, res) => {
  try {
    const { userId } = req.user;

    const host = await Host.findByPk(userId);
    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    };

    if (host.subscription === "Standard" && host.subscriptionExpired > currentDate) {
      return res.status(400).json({
        message: "You curently have an active Standard subscription, Would you like to upgrade to Premium?"
      })
    };

    const paymentDetails = {
      amount: 21000,
      currency: "NGN",
      reference: ref,
      customer: { email: host.email, name: host.fullName },
    };


    const response = await axios.post(
      "https://api.korapay.com/merchant/api/v1/charges/initialize",
      paymentDetails,
      {
        headers: { Authorization: `Bearer ${korapaySecret}` },
      }
    );

    const { data } = response.data;


    res.status(200).json({
      message: "Subscription for Premium initialized successfully",
      data: {
        reference: data.reference,
        checkout_url: data.checkout_url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error subscribing", data: error.message });
  }
};

exports.verifyPremiumSubscription = async (req, res) => {
  try {
    const { reference } = req.query;

    const response = await axios.get(
      `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${korapaySecret}`,
        },
      }
    );

    console.log("response", response.data.data.customer.email);

    const { data } = response;

    if (data?.status && data.data?.status === "success") {
      const email = data.data.customer.email
      const host = await Host.findOne({ where: { email: email } });
      if (!host) {
        return res.status(404).json({
          message: "Subscription failed: Host not found"
        })
      };
      host.subscription = "Premium"
      const expiryDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      host.subscriptionExpired = expiryDate;
      await host.save()
    };
    res.status(200).json({
      message: "Subscription for Premium verified successfully"
    })
  } catch (error) {
    console.error(`Error verifying Premium subscription: ${error.message}`);
    res.status(500).json({
      message: "Error verifying subscription",
      error: error.message
    });
  }
};
