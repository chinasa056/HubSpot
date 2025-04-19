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
const verifyUrl = "https://api.korapay.com/merchant/api/v1/charges"
// const currentDate = new Date()
const supportEmail = process.env.APP_USERNAME

exports.bookSpaceByHour = async (req, res) => {
  try {
    const ref = otpgenerator.generate(10, {
      lowerCaseAlphabets: true,
      upperCaseAlphabets: true,
      specialChars: false,
    });
    const { userId } = req.user;
    const { spaceId } = req.params;
    const { durationPerHour, startDate, checkinTime } = req.body;

    if (!durationPerHour || !startDate || !checkinTime) {
      return res.status(400).json({
        message: "Please fill out all fields"
      })
    };

    const currentDateTime = new Date(); 
    const datePart = new Date(startDate).toISOString().split("T")[0];
    const startDateTime = new Date(`${datePart}T${checkinTime}`); 
    
    if (startDateTime < currentDateTime) {
      return res.status(400).json({
        message: "Start date and check-in time cannot be in the past",
      });
    }
    
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

    if (space.isAvailable === false || space.listingStatus !== "active") {
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
    const currentDate = new Date()
    const { reference } = req.query;
    const booking = await Booking.findOne({ where: { reference } });

    if (!booking) {
      return res.status(404).json({
        message: "No booking found for this reference"
      })
    };

    const user = await User.findByPk(booking.userId);
    if (!user) {
      return res.status(404).json({
        message: `User not found for booking ID: ${booking.id}`,
      })
    };

    const space = await Space.findByPk(booking.spaceId);
    if (!space) {
      return res.status(404).json({
        message: "Booking Verification Failed: Space not found"
      })
    };

    const response = await axios.get(`${verifyUrl}/${reference}`, {
      headers: { Authorization: `Bearer ${korapaySecret}` }
    });

    const { data } = response;
    const firstName = user.fullName.split(" ")[0];

    const { startDate, checkinTime } = booking

    if (data?.status && data.data?.status === "success") {
      if (currentDate < booking.startDate) {
        booking.status = "upcoming"
      } else if (currentDate >= booking.startDate) {
        booking.status = "active";
      }
      const plainDate = new Date(startDate).toISOString().split('T')[0];
      const startDateTime = new Date(`${plainDate}T${checkinTime}`);

      booking.endDate = new Date(startDateTime.getTime() + Number(booking.durationPerHour) * 60 * 60 * 1000);

      // UPDATE THE SPACE APACITY DETAILS
      space.capacity -= 1
      space.bookingCount += 1

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

      const bookingDetails = {
        reference: booking.reference,
        startDate: booking.startDate,
        checkinTime: booking.checkinTime,
        endDate: booking.endDate
      }
      const successHtml = bookingSuccess(firstName, bookingDetails);

      const successMailOptions = {
        email: user.email,
        subject: "Booking Successful",
        html: successHtml,
      };

      await sendMail(successMailOptions);
      await booking.save();

      res.status(200).json({
        message: "booking verification is successful, please check your email for your booking details",
        data: reference
      });
    } else {
      booking.status = "failed";

      const failedeHtml = bookingFailure(
        firstName,
        booking.reference,
        supportEmail
      );

      const failureMailOptions = {
        email: user.email,
        subject: "booking Failed",
        html: failedeHtml,
      };

      await sendMail(failureMailOptions);
      await booking.save();

      res.status(200).json({
        message: "booking failed",
      });
    };

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error verifying booking by hour",
      error: error.message,
    })
  };
};

exports.bookSpaceByDay = async (req, res) => {
  try {
    const currentDate = new Date()
    const ref = otpgenerator.generate(10, {
      lowerCaseAlphabets: true,
      upperCaseAlphabets: true,
      specialChars: false,
    });
    const { userId } = req.user;
    const { spaceId } = req.params;
    const { durationPerDay, startDate, checkinTime } = req.body;

    if (!durationPerDay || !startDate || !checkinTime) {
      return res.status(400).json({
        message: "Please fill out all fields"
      })
    };

    if (new Date(startDate) < new Date(currentDate.setHours(0, 0, 0, 0))) {
      return res.status(400).json({
        message: "Start date cannot be in the past"
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: "Booking failed: User not found",
      });
    };

    const space = await Space.findByPk(spaceId);
    if (!space) {
      return res.status(404).json({
        message: "Space not found",
      });
    }

    if (space.capacity <= 0) {
      return res.status(400).json({
        message: "No available desks in this space",
      });
    }

    if (!space.isAvailable || space.listingStatus !== 'active') {
      return res.status(400).json({
        message: "Space is not available for booking",
      });
    }

    const totalAmount = durationPerDay * space.pricePerDay;

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
      durationPerDay,
      startDate,
      checkinTime,
      amount: totalAmount,
      status: 'pending',
      reference: data.reference,
      paymentDate: formattedDate
    });

    res.status(201).json({
      message: "Space booking per day successfully initialized",
      data: {
        reference: data.reference,
        checkout_url: data.checkout_url
      },
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error booking space by day",
      error: error.message,
    });
  }
};

exports.verifyBookingPerDay = async (req, res) => {
  try {
    const currentDate = new Date()
    const { reference } = req.query;
    const booking = await Booking.findOne({ where: { reference } });
    if (!booking) {
      return res.status(404).json({
        message: "No booking found for this reference"
      })
    };

    const user = await User.findByPk(booking.userId);
    if (!user) {
      return res.status(404).json({
        message: `User not found for booking ID: ${booking.id}`,
      })
    };

    const space = await Space.findByPk(booking.spaceId);
    if (!space) {
      return res.status(404).json({
        message: "Booking Verification Failed: Space not found"
      })
    };

    const response = await axios.get(`${verifyUrl}/${reference}`, {
      headers: { Authorization: `Bearer ${korapaySecret}` }
    });

    const { data } = response;

    const firstName = user.fullName.split(" ")[0];
    const { startDate, durationPerDay } = booking

    if (data?.status && data.data?.status === "success") {
      if (currentDate < booking.startDate) {
        booking.status = "upcoming"
      } else if (currentDate >= booking.startDate) {
        booking.status = "active";
      }
      booking.endDate = new Date(startDate.getTime() + durationPerDay * 24 * 60 * 60 * 1000); 

      // UPDATE THE SPACE APACITY DETAILS
      space.capacity -= 1
      space.bookingCount += 1

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

      const bookingDetails = {
        reference: booking.reference,
        startDate: booking.startDate,
        checkinTime: booking.checkinTime,
        endDate: booking.endDate
      }
      const successHtml = bookingSuccess(firstName, bookingDetails);

      const successMailOptions = {
        email: user.email,
        subject: "Booking Successful",
        html: successHtml,
      };

      await sendMail(successMailOptions);
      await booking.save();

      res.status(200).json({
        message: "booking verification is successful, please check your email for your booking details",
        data: reference,
        bookingDetails: booking
      });
    } else {
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
    console.error(error);
    res.status(500).json({
      message: "Error verifying booking per day",
      error: error.message,
    })
  };
};

// exports.checkBookingStatusForAllSpaces = async (req, res) => {
//   try {
//     const activeBookings = await Booking.findAll({ where: { status: "active" } });

//     if (activeBookings.length === 0) {
//       return res.status(200).json({ message: "No active bookings found." });
//     }

//     for (const booking of activeBookings) {
//       if (new Date(booking.endDate) < currentDate) {
//         booking.status = "expired";
//         await booking.save();

//         const space = await Space.findByPk(booking.spaceId);
//         if (space) {
//           space.capacity += 1; 
//           await space.save();
//         } else {
//           console.error(`Space not found for ID: ${booking.spaceId}`);
//         }
//         continue
//       }
//     }

//     res.status(200).json({
//       message: "Expired bookings processed successfully"
//     });

//   } catch (error) {
//     console.error("Error checking expired bookings:", error);
//     res.status(500).json({
//       message: "Error checking expired bookings",
//       error: error.message,
//     });
//   }
// }; 

// exports.checkBookingStatusForAllSpaces = async () => {
//   try {
//     const currentDate = new Date();

//     const bookings = await Booking.findAll();

//     if (bookings.length === 0) {
//       console.log("No bookings found.");
//       return;
//     }

//     for (const booking of bookings) {
//       if (new Date(booking.startDate) <= currentDate) {
//         booking.status = "active";
//         await booking.save();
//       }

//       else if (booking.status !== "expired" && new Date(booking.endDate) < currentDate) {
//         booking.status = "expired";
//         await booking.save();

//         const space = await Space.findByPk(booking.spaceId);
//         if (space) {
//           space.capacity += 1;
//           await space.save();
//         } else {
//           console.error(`Space not found for ID: ${booking.spaceId}`);
//         }
//       }
//     }

//     console.log("Booking status check completed.");

//   } catch (error) {
//     console.error("Error checking booking status:", error.message);
//   }
// };

exports.checkBookingStatusForAllSpaces = async () => {
  try {
    const currentDate = new Date();

    const bookings = await Booking.findAll();

    if (bookings.length === 0) {
      console.log("No bookings found.");
      return;
    };
    
    for (const booking of bookings) {
      const {startDate, checkinTime, endDate, status} = booking

      const startDateOnly = new Date(startDate).toISOString().split("T")[0];
      const combinedDateAndTime = `${startDateOnly}T${checkinTime}`;
      const startDateAndTime = new Date(combinedDateAndTime);

      if (startDateAndTime <= currentDate) {
        if (status !== "active") {
          status = "active";
          await booking.save();
        }
      }
      else if (status !== "expired" && new Date(endDate) < currentDate) {
        status = "expired";
        await booking.save();

        const space = await Space.findByPk(booking.spaceId);
        if (space) {
          space.capacity += 1;
          await space.save();
        } else {
          console.error(`Space not found for ID: ${booking.spaceId}`);
        }
      }
    };

    console.log("Booking status check completed.");

  } catch (error) {
    console.error("Error checking booking status:", error.message);
  }
};

