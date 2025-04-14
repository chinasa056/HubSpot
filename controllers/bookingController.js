const Booking = require("../models/booking");
const Host = require("../models/host");
const Space = require("../models/space");
const User = require("../models/user");
const axios = require("axios");
const otpgenerator = require("otp-generator");
const { bookingSuccess, bookingFailure } = require("../utils/mailTemplate");
const { sendMail } = require("../middleware/nodemailer");
const ref = otpgenerator.generate(10, {
  lowerCaseAlphabets: true,
  upperCaseAlphabets: true,
  specialChars: false,
});
const formattedDate = new Date().toLocaleString();
const korapaySecret = process.env.KORAPAY_SECRET_KEY;
const transactionUrl = "https://api.korapay.com/merchant/api/v1/charges/initialize"
// const verifyUrl = 
const currentDate = new Date()
const supportEmail = process.env.APP_USERNAME

exports.bookSpaceByHour = async (req, res) => {
  try {
    const { userId } = req.user;
    const { spaceId } = req.params;
    const { durationPerHour, startDate, checkinTime } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: "Booking failed: User not found",
      });
    };

    const space = await Space.findByPk(spaceId);
    if (!space) {
      return res.status(404).json({
        message: "Booking failed: Space not found",
      });
    };

    if (space.capacity <= 0) {
      return res.status(400).json({
        message: "No available desks in this space",
      });
    };

    if (!space.isAvailable || space.listingStatus !== "active") {
      return res.status(400).json({
        message: "Space is not available for booking",
      });
    };

    const totalAmount = durationPerHour * space.pricePerHour;

    const paymentDetails = {
      amount: totalAmount,
      currency: "NGN",
      reference: ref,
      customer: { email: user.email, name: user.fullName }
    };

    const response = await axios.post(transactionUrl, paymentDetails, {
      headers: { Authorization: `Bearer ${korapaySecret}` }
    });

    const { data } = response.data

    const booking = await Booking.create({
      userId,
      spaceId,
      userName: user.fullName,
      spaceName: space.name,
      durationPerHour,
      startDate,
      checkinTime,
      amount: totalAmount,
      status: "pending",
      reference: data.reference,
      paymentDate: formattedDate
    });

    res.status(201).json({
      message: "Space booking for hour initialized successfully",
      data: {
        reference: data.reference,
        checkout_url: data.checkout_url
      },
      booking
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error booking space by hour",
      error: error.message,
    });
  }
};

exports.verifyBookingPerhour = async (req, res) => {
  try {
    const reference = req.query;
    const booking = await Booking.findOne({ where: { reference } });
    if (!booking) {
      return res.status(404).json({
        message: "No booking found for this reference"
      })
    };

    const user = await User.findByPk(booking.userId);
    if (!user) {
      return res.status(404).json({
        message: `User not found for booking ID: ${subscription.id}`,
      })
    };

    const space = await Space.findByPk(booking.spaceId);
    if (!space) {
      return res.status(404).json({
        message: "Booking Verification Failed: Space not found"
      })
    };

    const response = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
      headers: { Authorization: `Bearer${korapaySecret}` }
    });

    const { data } = response;
    const link = `${req.protocol}://${req.get("host")}/api/v1/subscription`;
    const firstName = user.fullName.split(" ")[0];

    const { startDate, checkinTime } = booking

    if (data?.status && data.data?.status === "success") {
      if (currentDate < booking.startDate) {
        booking.status = "upcoming"
      } else if (currentDate >= booking.startDate) {
        booking.status = "active";
      }
      const startDateTime = new Date(`${startDate}T${checkinTime}`);
      booking.endDate = new Date(startDateTime);
      booking.endDate.setHours(startDateTime.getHours() + booking.durationPerHour); // Adds hours to the start time

      // UPDATE THE SPACE APACITY DETAILS
      space.capacity -= 1;
      space.bookingCount += 1;

      if (space.capacity === 0) {
        space.isAvailable = false;
      }
      await space.save();

      // Update the host's current balance
      const host = await Host.findByPk(space.hostId);
      if (host) {
        host.currentBalance += booking.amount;
        await host.save();
      }

      const successHtml = bookingSuccess(
        link,
        firstName,
        booking.reference,
        booking.startDate.toDateString(),
        booking.endDate.toDateString()
      );

      const successMailOptions = {
        email: user.email,
        subject: "Booking Successful",
        html: successHtml,
      };

      await sendMail(successMailOptions);
      await booking.save();

      res.status(200).json({
        message: "booking verification is successful",
        data: reference
      });
    }else {
      booking.status = "failed";

      const failedeHtml = bookingFailure(
        firstName,
        booking.reference,
      supportEmail
      );

      const failureMailOptions = {
        email: user.email,
        subject: "Subscription Failed",
        html: failedeHtml,
      };

      await sendMail(failureMailOptions);
      await booking.save();

      res.status(200).json({
        message: "Subscription failed",
      });
    };

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error booking space by hour",
      error: error.message,
    })
  };
};

// exports.bookSpaceByDay = async (req, res) => {
//   try {
//     const { userId, spaceId, durationPerDay, startDate, endDate } = req.body;

//     const space = await Space.findByPk(spaceId);
//     if (!space) {
//       return res.status(404).json({
//         message: "Space not found",
//       });
//     }

//     if (space.capacity <= 0) {
//       return res.status(400).json({
//         message: "No available desks in this space",
//       });
//     }

//     if (!space.isAvailable || space.listingStatus !== 'active') {
//       return res.status(400).json({
//         message: "Space is not available for booking",
//       });
//     }

//     const totalAmount = durationPerDay * space.pricePerDay;

//     const booking = await Booking.create({
//       userId,
//       spaceId,
//       userName: req.user.fullName,
//       spaceName: space.name,
//       durationPerDay,
//       startDate,
//       endDate,
//       amount: totalAmount,
//       status: 'pending',
//     });

//     space.capacity -= 1;

//     if (space.capacity === 0) {
//       space.isAvailable = false;
//     }
//     await space.save();

//     const host = await Host.findByPk(space.hostId);
//     if (host) {
//       host.currentBalance += totalAmount;
//       await host.save();
//     }

//     res.status(201).json({
//       message: "Space booked successfully by day",
//       data: booking,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({
//       message: "Error booking space by day",
//       error: error.message,
//     });
//   }
// };