const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verify } = require("../utils/mailTemplate");
const { sendMail } = require("../middleware/nodemailer");
const cloudinary = require("../database/cloudinary");
const fs = require("fs");
const Host = require("../models/host");
const { resetPasswordMail } = require("../utils/reset-password-mail");
const Space = require("../models/space");
const Booking = require("../models/booking");
const sequelize = require("../database/dbConnect");

exports.registerHost = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, companyName, companyAddress, meansOfIdentification, idCardNumber } = req.body;

    const file = req.file;

    // if(!file) {
    //   return res.status(400).json({
    //     messsage: "Please upload an image for this field"
    //   })
    // };

    const name = fullName?.split(' ');
    const nameFormat = name.map((e) => { return e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase() }).join(' ');
    
    const hostExists = await Host.findOne({ where: { email: email.toLowerCase() } });

    if (hostExists) {
      // fs.unlinkSync(file?.path);
      return res.status(400).json({
        message: `Host with email: ${email} already exists`,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // const result = await cloudinary.uploader.upload(file.path);
    // console.log(file.path)

    // if (fs.existsSync(file.path)) {
    //   fs.unlinkSync(file.path);
    // } else {
    //   console.warn('File already deleted or missing:', file.path);
    // }

    const hostData = {
      fullName: nameFormat.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      companyName,
      companyAddress,
      meansOfIdentification,
      idCardNumber,
      // ninImage: {
      //   secureUrl: result.secure_url,
      //   publicId: result.public_id
      // }
    };
    
    const host = await Host.create(hostData);

    const token = jwt.sign({ hostId: host.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const link = `${req.protocol}://${req.get("host")}/api/v1/host/verify/${token}`;
    const firstName = host.fullName.split(" ")[0];

    const mailOptions = {
      email: email,
      subject: "Account Verification",
      html: verify(link, firstName),
    };

    await sendMail(mailOptions);

    res.status(201).json({
      message: "Account registered successfully. Please check your email for verification.",
      data: host,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error Registering User",
      error: error.message
    });
  }

};

exports.verifyHost = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: "Verification token is missing",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const { hostId } = jwt.decode(token);
          const host = await Host.findByPk(hostId);

          if (!host) {
            return res.status(404).json({
              message: "Account not found",
            });
          }

          if (host.isVerified) {
            return  res.redirect("https://hubspot-liard.vercel.app/hostlogin")
            
          }

          // Generate a new token and send verification email
          const newToken = jwt.sign({ hostId: host.id }, process.env.JWT_SECRET, { expiresIn: "1hour" });
          const link = `${req.protocol}://${req.get("host")}/api/v1/host/verify/${newToken}`;
          const firstName = host.fullName.split(" ")[0];

          const mailOptions = {
            email: host.email,
            subject: "Resend: Account Verification",
            html: verify(link, firstName),
          };

          await sendMail(mailOptions);

          return res.status(200).json({
            message: "Session expired: A new verification link has been sent to your email.",
          });
        }
      } else {
        const host = await Host.findByPk(payload.hostId);

        if (!host) {
          return res.status(404).json({
            message: "Account not found",
          });
        }

        if (host.isVerified === true) {
          res.redirect("https://hubspot-liard.vercel.app/hostlogin");
        }

        host.isVerified = true;
        await host.save();

        res.redirect("https://hubspot-liard.vercel.app/hostlogin");
      }
    });
  } catch (error) {
    console.error(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: "Session expired: A new link has been sent to your email address.",
      });
    }
    res.status(500).json({
      message: "Error verifying host",
    });
  }
};

exports.loginHost = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please input both email and password",
      });
    }

    // Find host by email
    const host = await Host.findOne({ where: { email: email.toLowerCase() } });
    if (!host) {
      return res.status(404).json({
        message: "login failed: incorrect credentials",
      });
    }

    // Validate password
    const isCorrectPassword = await bcrypt.compare(password, host.password);
    if (!isCorrectPassword) {
      return res.status(400).json({
        message: "Incorrect credentials",
      });
    }

    // Check if account is verified
    if (!host.isVerified) {
      return res.status(400).json({
        message: "Account is not verified. Please check your email for the verification link.",
      });
    }

    host.isLoggedin = true;
    const token = jwt.sign(
      { userId: host.id, isLoggedIn: host.isLoggedIn },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    await host.save();

    res.status(200).json({
      message: "Account successfully logged in",
      data: host.fullName,
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.forgottenPasswordHost = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide your email address",
      });
    }

    const host = await Host.findOne({ where: { email: email.toLowerCase() } });

    if (!host) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const token = jwt.sign({ userId: host.id }, process.env.JWT_SECRET, { expiresIn: "1day" });
    const link = `${req.protocol}://${req.get("host")}/api/v1/host/reset-password/${token}`;
    const firstName = host.fullName.split(" ")[0];

    const mailOptions = {
      email: host.email,
      subject: "Reset Password",
      html: resetPasswordMail(link, firstName),
    };

    await sendMail(mailOptions);

    res.status(200).json({
      message: "A password reset link has been sent to your email address",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Forgotten password failed",
      data: error.message
    });
  }
};

exports.resetPasswordHost = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Please provide both newPassword and confirmPassword",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const host = await Host.findByPk(userId);
    if (!host) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    host.password = hashedPassword;
    await host.save();

    res.status(200).json({
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error(error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: "Session expired. Please request a new password reset link.",
      });
    }

    res.status(500).json({
      message: "Error resetting password",
      data: error.message,
    });
  }
};

exports.changePasswordHost = async (req, res) => {
  try {
    const { hostId } = req.params;
    const { password, newPassword, confirmPassword } = req.body;

    if (!password || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Please provide the current password, newPassword, and confirmPassword",
      });
    }

    const host = await Host.findByPk(hostId);
    if (!host) {
      return res.status(404).json({
        message: "Host not found",
      });
    }

    if (!host.isLoggedIn) {
      return res.status(401).json({
        message: "Authentication Failed: Host is not logged in",
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, host.password);
    if (!isCorrectPassword) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    host.password = hashedPassword;
    await host.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error changing password",
    });
  }
};

exports.loggedOutHost = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Find the host by email
    const host = await Host.findOne({ where: { email: email.toLowerCase() } });

    if (!host) {
      return res.status(404).json({
        message: "Host does not exist",
      });
    }

    // Update login status
    host.isLoggedIn = false;
    await host.save();

    res.status(200).json({
      message: "Host logged out successfully",
    });
  } catch (error) {
    console.error("Error logging out:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.updateHostDetails = async (req, res) => {
  try {
    const { hostId } = req.params;
    const updates = req.body;
    const file = req.file;

    const host = await Host.findByPk(hostId);
    if (!host) {
      return res.status(404).json({
        message: "Host not found",
      });
    }

    let profileImageUrl = []
    if (file) {
      try {
        const result = await cloudinary.uploader.upload(file.path);
        const profileImageDetails = {
          secureUrl: result.secure_url,
          publicId: result.public_id
        };
        profileImageUrl.push(profileImageDetails)
        updates.profileImage = profileImageUrl
        fs.unlinkSync(file.path);

      } catch (uploadError) {
        fs.unlinkSync(file.path);
        return res.status(500).json({
          message: "Error uploading profile image",
        });
      }
    }

    const updatedHost = await host.update(updates);

    res.status(200).json({
      message: "Host details updated successfully",
      data: updatedHost,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error updating host details",
    });
  }
};

exports.deleteHostAccount = async (req, res) => {
  try {
    const { hostId } = req.params;

    const host = await Host.findByPk(hostId);
    if (!host) {
      return res.status(404).json({
        message: "host not found",
      });
    }

    if (host.profileImage && host.profileImage.publicId) {

      // const publicId = host.profileImage.split("/").pop().split(".")[0];

      await cloudinary.uploader.destroy(host.profileImage.publicId);
    }


    await host.destroy();

    res.status(200).json({
      message: "User and profile image deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error deleting user account",
      error: error.message,
    });
  }
};

// HOST DASHBOARD
// GET THE TOTAL NUMBER OF SPACES AND THEIR COUNT
exports.getSpacesByHost = async (req, res) => {
  try {
    const { userId: hostId } = req.user;

    const spaces = await Space.findAll({
      where: { hostId }
    });

    const spaceCount = spaces.length
    if (spaceCount === 0) {
      return res.status(404).json({
        message: "No Spaces Found for This Host",
      });
    }

    res.status(200).json({
      message: "Spaces Found for This Host",
      data: spaces,
      count: spaceCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error Fetching Spaces by Host",
      data: error.message,
    });
  }
};

// MANAGE BOOKINGS
exports.getSpaceBookings = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const space = await Space.findByPk(spaceId, {
      attributes: ['name'],
      include: [
        {
          model: Booking,
          attributes: ['userName', 'startDate', 'endDate', 'status'],
        },
      ],
    });

    if (!space) {
      return res.status(404).json({
        message: "Space not found",
      });
    }

    res.status(200).json({
      message: "Space and bookings retrieved successfully",
      data: space,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error fetching space bookings",
      error: error.message
    });
  }
};

// MANAGE LISTING
exports.manageListing = async (req, res) => {
  try {
    const { userId: hostId } = req.user;

    const host = await Host.findByPk(hostId);
    if (!host) {
      return res.status(404).json({
        message: "Host not found"
      })
    };

    const spaces = await Space.findAll({
      where: { hostId },
      attributes: ["name", "bookingCount", "createdAt", "capacity", "listingStatus"]
    });

    if (spaces.length === 0) {
      return res.status(400).json({
        message: "No spaces listed for this host"
      })
    };

    res.status(200).json({
      message: "Space listings for this host",
      data: spaces
    })



  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error categorizing bookings",
      error: error.message
    });
  }
}

// HOST DASHbOARD (DASHBOARD)
exports.getBookingCategories = async (req, res) => {
  try {
    const { userId: hostId } = req.user;
    const currentDate = new Date();

    const spaces = await Space.findAll({
      where: { hostId },
      include: [
        {
          model: Booking,
          attributes: ["userName", "status", "startDate", "endDate"],
        },
      ],
    });


    const upcomingBookings = [];
    const activeBookings = [];
    const completedBookings = [];
    //  const spaceId =  spaces.map((space) => space.id)
    for (const space of spaces) {
      const booking = await Booking.findAll({ where: { spaceId: space.id } });
      if (new Date(booking.startDate) > currentDate) {
        upcomingBookings.push(booking);
      } else if (
        new Date(booking.startDate) <= currentDate &&
        new Date(booking.endDate) >= currentDate
      ) {
        activeBookings.push(booking);
      } else if (new Date(booking.endDate) < currentDate) {
        completedBookings.push(booking);
      }

    };

    const upcomingCount = upcomingBookings.length;
    const activeCount = activeBookings.length;
    const completedCount = completedBookings.length;


    // spaces.forEach((space) => {
    //   space.Bookings.forEach((booking) => {
    //     const { startDate, endDate } = booking;
    //     if (new Date(startDate) > currentDate) {
    //       upcomingBookings.push(booking);
    //     } else if (
    //       new Date(startDate) <= currentDate &&
    //       new Date(endDate) >= currentDate
    //     ) {
    //       activeBookings.push(booking);
    //     } else if (new Date(endDate) < currentDate) {
    //       completedBookings.push(booking);
    //     }
    //   });
    // });



    res.status(200).json({
      message: "Bookings categorized successfully",
      data: {
        // upcomingBookings,
        // activeBookings,
        // completedBookings,
        counts: {
          upcoming: upcomingCount,
          active: activeCount,
          completed: completedCount,
        },
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error categorizing bookings",
      error: error.message,
    });
  }
};