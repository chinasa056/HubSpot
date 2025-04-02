const Host = require("../models/host");
const cloudinary = require("../config/cloudinary")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verify,} = require("../utils/mailTemplate");
const { sendMail } = require("../middleware/nodemailer");
const {resetPasswordMail} = require("../utils/reset-password-mail")
const fs = require('fs');
const Host = require("../models/host");


exports.register = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword,} = req.body;
        const file = req.file;

        const hostExists = await Host.findOne({ where: { email: email.toLowerCase() } });

        if (hostExists) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({
                message: `Host with email: ${email} already exists`,
            });
        }

        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profileImageUrl = null; // Initialize profileImage URL
        let identificationUrl = null;
        if (file) {
            const result = await cloudinary.uploader.upload(file.path)
            profileImageUrl = result.secure_url;
            identificationUrl = result.secure_url;
            fs.unlinkSync(file.path);
        }

        const hostData= {
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            companyName,
            companyAddress,
            profileImage: profileImageUrl,
            identification:identificationUrl,
        };
  
        const Host = await Host.create(hostData)
        const token = jwt.sign({ hostId: Host.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const link = `${req.protocol}://${req.get("host")}/host/verify/${token}`;
        const firstName = Host.fullName.split(" ")[0];
`
        const mailOptions` = {
            email: user.email,
            subject: "Account Verification",
            html: verify(link, firstName),
        };
        
        await sendMail(mailOptions);
        
        res.status(201).json({
            message: "Account registered successfully. Please check your email for verification.",
            data: Host,
        });
    } catch (error) {
        console.error(error.message);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            message: "Error registering host",
        });
    }
};
exports.verify = async (req, res) => {
    try {
      const { token } = req.params;
  
      if (!token) {
        return res.status(404).json({
          message: 'Token not found'
        })
      };
  
      jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
        if (error) {
          if (error instanceof jwt.JsonWebTokenError) {
            const { hostId } = jwt.decode(token);
            const host = await Host.findById(hostId);
  
            if (!host) {
              return res.status(404).json({
                message: 'Account not found'
              })
            };
  
            if (host.isVerified === true) {
              return res.status(400).json({
                message: 'Account is verified already'
              })
            };
  
            const newToken = jwt.sign({ hostId: host._id }, process.env.JWT_SECRET, { expiresIn: '5mins' });
            const link = `${req.protocol}://${req.get('host')}/api/v1/verify/host/${newToken}`;
            const firstName = host.fullName.split(' ')[0];
  
            const mailOptions = {
              email: host.email,
              subject: 'Resend: Account Verification',
              html: verify(link, firstName)
            };
  
            await resetPasswordMail(mailOptions);
            res.status(200).json({
              message: 'Session expired: Link has been sent to email address'
            })
          }
        } else {
          const host = await Host.findByPk(payload.hostId);
  
          if (!host) {
            return res.status(404).json({
              message: 'Account not found'
            })
          };
  
          if (host.isVerified === true) {
            return res.status(400).json({
              message: 'Account is verified already'
            })
          };
  
          host.isVerified = true;
          await host.save();
  
          res.status(200).json({
            message: 'Account verified successfully'
          })
        }
      });
    } catch (error) {
      console.log(error.message);
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({
          message: 'Session expired: link has been sent to email address'
        })
      }
      res.status(500).json({
        message: 'Error Verifying user'
      })
    }
  };
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "you need both email and password",
            });
        }

        const host = await host.findOne({ where: { email: email.toLowerCase() } });
        if (!host) {
            return res.status(404).json({
                message: "host not found",
            });
        }

        const isCorrectPassword = await bcrypt.compare(password, host.password);
        if (!isCorrectPassword) {
            return res.status(400).json({
                message: "Incorrect password",
            });
        }

        if (!host.isVerified) {
            return res.status(400).json({
                message: "Account is not verified. Please check your email for the verification link.",
            });
        }

        host.isLoggedIn = true;
        const token = jwt.sign(
            { hostId: host.id, isLoggedIn: host.isLoggedIn },
            process.env.JWT_SECRET,
            { expiresIn: "1day" }
        );

        await host.save();

        res.status(200).json({
            message: "Account successfully logged in",
            data: {
                id: host.id,
                email: host.email,
                fullName: host.fullName,
            },
            token,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

exports.forgottenPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Please provide your email address",
            });
        }

        // Find the user by email
        const host = await host.findOne({ where: { email: email.toLowerCase() } });

        if (!host) {
            return res.status(404).json({
                message: "Account not found",
            });
        }

        // Ensure the user is logged in before allowing password reset
        if (!host.isLoggedIn) {
            return res.status(401).json({
                message: "Authentication failed: host is not logged in",
            });
        }

        // Generate reset token and link
        const token = jwt.sign({ hostId: host.id }, process.env.JWT_SECRET, { expiresIn: "5m" });
        const link = `${req.protocol}://${req.get("host")}/api/v1/host/reset_password/${token}`;
        const firstName = host.fullName.split(" ")[0];

        // Prepare and send reset email
        const mailOptions = {
            email: host.email,
            subject: "Reset Password",
            html: verify(link, firstName),
        };

        await resetPasswordMail(mailOptions);

        res.status(200).json({
            message: "A password reset link has been sent to your email address",
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Forgotten password failed",
        });
    }
};

exports.resetPassword = async (req, res) => {
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

        const { hostId } = jwt.verify(token, process.env.JWT_SECRET);

        const host = await userModel.findByPk(hostId);
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
        console.error(error.message);

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: "Session expired. Please request a new password reset link.",
            });
        }

        res.status(500).json({
            message: "Error resetting password",
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { hostId } = req.params;
        const { password, newPassword, confirmPassword } = req.body;

        if (!password || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "Please provide the current password, newPassword, and confirmPassword",
            });
        }

        const host = await host.findByPk(hostId);
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

exports.loggedOut = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const host = await host.findOne({ where: { email: email.toLowerCase() } });

        if (!host) {
            return res.status(404).json({
                message: "host does not exist",
            });
        }

        host.isLoggedIn = false;
        await host.save();

        res.status(200).json({
            message: "host logged out successfully",
        });
    } catch (error) {
        console.error("Error logging out:", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
