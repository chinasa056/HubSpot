const Subscription = require("../models/subscription");
const Host = require("../models/host");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const Plan = require("../models/plan");
const { sendMail } = require("../middleware/nodemailer");
const { verify } = require("jsonwebtoken");
const { successfulSubscription } = require("../utils/success_mailTemplate");
const { failedSubscription } = require("../utils/failed_mailTemplate");
const { expirationReminder } = require("../utils/mailTemplate");
const formattedDate = new Date().toLocaleString();
const ref = otpGenerator.generate(10, {
  lowerCaseAlphabets: true,
  upperCaseAlphabets: true,
  specialChars: false,
});
const korapaySecret = process.env.KORAPAY_SECRET_KEY;

// CREATING PLAN
exports.createSubcriptionPlan = async (req, res) => {
  try {
    const { planName, amount, description } = req.body;
    const existingPlan = await Plan.findOne({ where: { planName } });
    if (existingPlan) {
      return res.status(400).json({
        message: "Plan already exist",
      });
    }

    const newPlan = await Plan.create({
      planName,
      amount,
      description,
    });

    res.status(201).json({
      message: "Plan created successfully",
      data: newPlan,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating subsription ",
      data: error.message,
    });
  }
};

exports.getAllPlan = async (req, res) => {
  try {
    const plans = await Plan.findAll();

    if (plans.length === 0) {
      return res.status(404).json({
        message: "Plan has not been added",
      });
    }

    res.status(200).json({
      message: "All subscription plans",
      data: plans,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating subsription ",
      data: error.message,
    });
  }
};

exports.getPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await Plan.findByPk(planId);

    if (!plan) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }

    res.status(200).json({
      message: "All details for this plan",
      data: plan,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error getting plan",
    });
  }
};

//   SUBSCRIPTION
exports.initializeSubscription = async (req, res) => {
  try {
    const { userId: hostId } = req.user;
    const { planId } = req.params;

    const host = await Host.findByPk(hostId);
    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }

    const plan = await Plan.findByPk(planId);

    if (!plan) {
      return res
        .status(404)
        .json({ message: "Subscription failed: Plan not found" });
    }

    const existingSubscription = await Subscription.findOne({
      where: { hostId },
      order: [["endDate", "DESC"]], // Fetch the latest subscription
    });

    if (
      existingSubscription && new Date() < new Date(existingSubscription.endDate)
    ) {
      return res.status(400).json({
        message:
          "You already have an active subscription. Please wait until it expires.",
      });
    };
    if (existingSubscription && existingSubscription.status === "pending") {
      return res.status(400).json({
        message: "You already have an active subscription"
      })
    }

    const paymentDetails = {
      amount: plan.amount,
      currency: "NGN",
      reference: ref,
      customer: { email: host.email, name: host.fullName },
    };

    console.log(paymentDetails);

    const response = await axios.post(
      "https://api.korapay.com/merchant/api/v1/charges/initialize",
      paymentDetails,
      {
        headers: { Authorization: `Bearer ${korapaySecret}` },
      }
    );

    const { data } = response.data;

    const subscription = await Subscription.create({
      hostId,
      planId,
      planName: plan.planName,
      amount: plan.amount,
      reference: data.reference,
      paymentDate: new Date().toISOString(),
    });

    res.status(200).json({
      message: "Subscription initialized successfully",
      data: {
        reference: data.reference,
        checkout_url: data.checkout_url,
      },
      subscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error subscribing", data: error.message });
  }
};

exports.verifySubscription = async (req, res) => {
  try {
    const { reference } = req.query;
    const subscription = await Subscription.findOne({ where: { reference } });
    if (!subscription) {
      return res.status(404).json({
        message: `No subscription found for reference: ${reference}`,
      });
    }

    const host = await Host.findByPk(subscription.hostId);
    if (!host) {
      return res.status(404).json({
        message: `Host not found for subscription ID: ${subscription.id}`,
      });
    }

    const response = await axios.get(
      `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${korapaySecret}`,
        },
      }
    );

    const { data } = response;
    const link = `${req.protocol}://${req.get("host")}/api/v1/subscription`;
    const firstName = host.fullName.split(" ")[0];
    console.log(subscription);


    if (data?.status && data.data?.status === "success") {
      subscription.status = "active";
     subscription.startDate = new Date()
     subscription.endDate = new Date(subscription.startDate.getTime() + 1 * 60 * 60 * 1000); // Add 1 hour
    //  subscription.endDate = new Date(
    //    subscription.startDate.getTime() + 30 * 24 * 60 * 60 * 1000
    //  ); // Add 30 days to startDate

    //  const currentDate = new Date();
    //  const yesterday = new Date(currentDate);
    //  yesterday.setDate(currentDate.getDate() - 1);
    //  subscription.startDate = yesterday;
    //   // Set endDate to be 1 hour from the backdated startDate
    //   subscription.endDate = new Date(subscription.startDate.getTime() + 1 * 60 * 60 * 1000); // Add 1 hour


      // send a success email
      const successHtml = successfulSubscription(
        link,
        firstName,
        subscription.planName,
        subscription.startDate.toDateString(),
        subscription.endDate.toDateString()
      );

      const successMailOptions = {
        email: host.email,
        subject: "Subscription Successful",
        html: successHtml,
      };

      await sendMail(successMailOptions);
      await subscription.save();

      res.status(200).json({
        message: "Subscription is successful",
      });
    } else {
      subscription.status = "failed";

      const failedeHtml = failedSubscription(
        link,
        firstName,
        subscription.planName
      );

      const failureMailOptions = {
        email: host.email,
        subject: "Subscription Failed",
        html: failedeHtml,
      };

      await sendMail(failureMailOptions);
      await subscription.save();

      console.log(`Subscription ${subscription.id} updated to Failed`);
      res.status(200).json({
        message: "Subscription failed",
      });
    }
  } catch (error) {
    console.error(`Error verifying subscription: ${error.message}`);
    res.status(500).json({
      message: "Error verifying subscription",
    });
  }
};

exports.getAllSubscription = async (req, res) => {
  try {
    const { hostId } = req.params;
    const host = await Host.findById(hostId);
    if (!host) {
      return res.status(404).json({
        message: "Host Not found",
      });
    }

    const allSubscription = await Subscription.findAll({ where: { hostId } });

    res.status(200).json({
      message: "All subscriptions for this host in the database",
      date: allSubscription,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error Fetching Subscriptions ",
      data: error.message,
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



