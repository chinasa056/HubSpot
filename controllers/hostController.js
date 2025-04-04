const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verify } = require("../utils/mailTemplate");
const { sendMail } = require("../middleware/nodemailer");
const cloudinary = require("../database/cloudinary");
const fs = require("fs");
const Host = require("../models/host");
const { resetPasswordMail } = require("../utils/reset-password-mail");

exports.registerHost = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      companyName,
      companyAddress,
    } = req.body;
    const file = req.file;

    // Check if host already exists
    const hostExists = await Host.findOne({ where: { email: email.toLowerCase() } });

    if (hostExists) {
      if (file) fs.unlinkSync(file.path);
      return res.status(400).json({
        message: `Host with email: ${email} already exists`,
      });
    }

    // Validate required fields
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle profile image and identification uploads
    let profileImageUrl = null;
    // let identificationUrl = null;
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      profileImageUrl = result.secure_url;
    //   identificationUrl = result.secure_url; // Adjust if needed
      fs.unlinkSync(file.path);
    }

    // Create host data object
    const hostData = {
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      companyName,
      companyAddress,
      profileImage: profileImageUrl,
    //   identification: identificationUrl,
    };

    // Create new host
    const host = await Host.create(hostData);

    // Generate verification token
    const token = jwt.sign({ hostId: host.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const link = `${req.protocol}://${req.get("host")}/api/v1/host/verify/${token}`;
    const firstName = host.fullName.split(" ")[0];

    // Prepare verification email
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
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      message: `Error registering host: ${error.message}`,
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
          const { hostId } = jwt.decode(token); // Decode token to fetch host ID
          const host = await Host.findByPk(hostId);

          if (!host) {
            return res.status(404).json({
              message: "Account not found",
            });
          }

          if (host.isVerified) {
            return res.status(400).json({
              message: "Account is already verified",
            });
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

        if (host.isVerified) {
          return res.status(400).json({
            message: "Account is already verified",
          });
        }

        host.isVerified = true;
        await host.save();

        res.status(200).json({
          message: "Account verified successfully",
        });
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
        message: "Host not found",
      });
    }

    // Validate password
    const isCorrectPassword = await bcrypt.compare(password, host.password);
    if (!isCorrectPassword) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    // Check if account is verified
    if (!host.isVerified) {
      return res.status(400).json({
        message: "Account is not verified. Please check your email for the verification link.",
      });
    }

    // Update login status
    host.isLoggedin = true; // Ensure the Host model includes an `isLoggedIn` field
    const token = jwt.sign(
      { userId: host.id, isLoggedIn: host.isLoggedIn },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    await host.save();

    res.status(200).json({
      message: "Account successfully logged in",
      data: host,
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

    // Find the host by email
    const host = await Host.findOne({ where: { email: email.toLowerCase() } });

    if (!host) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // Generate reset token and link
    const token = jwt.sign({ userId: host.id }, process.env.JWT_SECRET, { expiresIn: "1day" });
    const link = `${req.protocol}://${req.get("host")}/api/v1/host/reset-password/${token}`;
    const firstName = host.fullName.split(" ")[0];

    // Prepare and send reset email
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

    // Verify token and extract hostId
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Find host by primary key
    const host = await Host.findByPk(userId);
    if (!host) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update host password
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

    // Find the host by ID
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

    // Validate current password
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

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update host's password
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

