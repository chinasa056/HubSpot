const Space = require("../models/space");
const Subscription = require("../models/subscription");
const Host = require("")
const axios = require("axios")
const otpGenerator = require("otp-generator");
const formattedDate = new Date().toLocaleString();
const ref = otpGenerator.generate(10, { lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: false })
const korapaySecret = process.env.KORAPAY_SECRET_KEY

exports.initializeSubscription = async (req, res) => {
    try {
        const { hostId } = req.user
        const { amount } = req.body

        const host = await Host.findById(hostId);
        if (!host) {
            return res.status(404).json({
                message: "Host not found"
            })
        };

        const space = await Space.findOne({ where: { hostId } });
        if (!space) {
            return res.status(404).json({
                message: "This host does not have a space"
            })
        };

        const paymentDetails = {
            amount,
            currency: "NGN",
            reference: ref,
            customer: { email: host.email, name: host.fullName }
        };

        axios.post("https://api.korapay.com/merchant/api/v1/charges/initialize", paymentDetails, {
            headers: {
                Authorization: `Bearer ${korapaySecret}`
            }
        });

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const { data } = response?.data;

        const subscription = await Subscription.create({
            hostId,
            spaceName: space.name,
            amount,
            startDate,
            endDate,
            reference,
            paymentDate: formattedDate

        })

        res.status(200).json({
            message: 'subscription initialized successfully',
            data: {
                reference: data.reference,
                checkout_url: data.checkout_url
            },
            subscription
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error subscribing ",
            data: error.message
        })
    }
};

exports.verifySubscription = async (req, res) => {
    try {
        const { hostId } = req.user
        const { reference } = req.query;
        const subscription = await Subscription.findOne({ where: { reference } });
        const Host = await Host.findByPk(hostId);

        if (!Host) {
            return res.status(404).json({
                message: 'Host not found'
            })
        };

        if (!subscription) {
            return res.status(404).json({
                message: 'No subscription for this host'
            })
        };

        const response = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
            headers: {
                Authorization: `Bearer ${koraSecretKey}`
            }
        });

        const { data } = response;

        if (data.status && data.data.status === 'success') {
            subscription.status = 'Success';
            await subscription.update()
            res.status(200).json({
                message: 'Transaction is successful'
            })
        } else {
            subscription.status = 'Failed'
            await subscription.save();

            res.status(200).json({
                message: 'Transaction failed'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error verifying subscription'
        })
    }
};

exports.renewSubscription = async (req, res) => {
    try {
        const { hostId } = req.user;
        const { amount } = req.body;

        // Step 1: Fetch the active subscription
        const subscription = await Subscription.findOne({
            where: { hostId, status: "Active" },
        });
        if (!subscription) {
            return res.status(404).json({
                message: "No active subscription found for this host",
            });
        }

        // Step 2: Calculate leftover days
        const currentDate = new Date();
        const endDate = new Date(subscription.endDate);

        let leftoverDays = 0;
        if (endDate > currentDate) {
            // Calculate difference in days
            const diffTime = Math.abs(endDate - currentDate); // Difference in milliseconds
            leftoverDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
        }

        // Step 3: Extend the subscription duration
        const newEndDate = new Date(currentDate);
        newEndDate.setMonth(newEndDate.getMonth() + 1); // Add 1 month
        newEndDate.setDate(newEndDate.getDate() + leftoverDays); // Add leftover days

        // Step 4: Process payment for renewal
        const paymentDetails = {
            amount,
            currency: "NGN",
            reference: otpGenerator.generate(10, { lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: false }),
            customer: { email: subscription.hostEmail, name: subscription.hostName },
        };
        const response = await axios.post(
            "https://api.korapay.com/merchant/api/v1/charges/initialize",
            paymentDetails,
            { headers: { Authorization: `Bearer ${korapaySecret}` } }
        );
        const { data } = response?.data;

        // Step 5: Update subscription record
        subscription.endDate = newEndDate;
        await subscription.save();

        res.status(200).json({
            message: "Subscription renewed successfully",
            data: {
                reference: data.reference,
                checkout_url: data.checkout_url,
                newEndDate,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error renewing subscription",
            data: error.message,
        });
    }
};
