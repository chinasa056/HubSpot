const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verify } = require("../utils/mailTemplate");
const { sendMail } = require("../middleware/nodemailer");
const cloudinary = require("../database/cloudinary");
const fs = require("fs");
const User = require("../models/user");
const { resetPasswordMail } = require("../utils/reset-password-mail");
const Booking = require("../models/booking");
const Space = require("../models/space");

exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;
        const file = req.file;

        const userExists = await User.findOne({
            where: { email: email.toLowerCase() },
        });

        if (userExists) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({
                message: `User with email: ${email} already exists`,
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profileImageUrl = null;
        if (file) {
            const result = await cloudinary.uploader.upload(file.path);
            const picture = {
                secureUrl: result.secure_url,
                publicId: result.public_id,
            };
            profileImageUrl = picture;
            fs.unlinkSync(file.path);
        }

        const userData = {
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            profileImage: profileImageUrl,
        };

        const user = await User.create(userData);

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const link = `${req.protocol}://${req.get(
            "host"
        )}/api/v1/users/verify/${token}`;
        const firstName = user.fullName.split(" ")[0];

        const mailOptions = {
            email: user.email,
            subject: "Account Verification",
            html: verify(link, firstName),
        };

        await sendMail(mailOptions);

        res.status(201).json({
            message:
                "Account registered successfully. Please check your email for verification.",
            data: user,
        });
    } catch (error) {
        console.error(error);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            message: "Error registering user",
            data: error.message,
        });
    }
};

exports.verifyUser = async (req, res) => {
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
                    const { userId } = jwt.decode(token); // Decode token to fetch user ID
                    const user = await userModel.findByPk(userId);

                    if (!user) {
                        return res.status(404).json({
                            message: "Account not found",
                        });
                    }

                    if (user.isVerified) {
                        return res.status(400).json({
                            message: "Account is already verified",
                        });
                    }

                    // Generate a new token and send verification email
                    const newToken = jwt.sign(
                        { userId: user.id },
                        process.env.JWT_SECRET,
                        { expiresIn: "1hour" }
                    );
                    const link = `${req.protocol}://${req.get(
                        "host"
                    )}/api/v1/users/verify/${newToken}`;
                    const firstName = user.fullName.split(" ")[0];

                    const mailOptions = {
                        email: user.email,
                        subject: "Resend: Account Verification",
                        html: verify(link, firstName),
                    };

                    await sendMail(mailOptions);

                    return res.status(200).json({
                        message:
                            "Session expired: A new verification link has been sent to your email.",
                    });
                }
            } else {
                const user = await User.findByPk(payload.userId);

                if (!user) {
                    return res.status(404).json({
                        message: "Account not found",
                    });
                }

                if (user.isVerified) {
                    return res.status(400).json({
                        message: "Account is already verified",
                    });
                }

                user.isVerified = true;
                await user.save();

                res.status(200).json({
                    message: "Account verified successfully",
                });
            }
        });
    } catch (error) {
        console.error(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message:
                    "Session expired: A new link has been sent to your email address.",
            });
        }
        res.status(500).json({
            message: "Error verifying user",
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please input both email and password",
            });
        }

        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return res.status(400).json({
                message: "Incorrect password",
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                message:
                    "Account is not verified. Please check your email for the verification link.",
            });
        }

        user.isLoggedin = true;
        const token = jwt.sign(
            { userId: user.id, isAdmin: user.isAdmin, isLoggedIn: user.isLoggedIn },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        await user.save();

        res.status(200).json({
            message: "Account successfully logged in",
            data: user,
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
        const user = await User.findOne({ where: { email: email.toLowerCase() } });

        if (!user) {
            return res.status(404).json({
                message: "Account not found",
            });
        }

        // Generate reset token and link
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1day",
        });
        const link = `${req.protocol}://${req.get(
            "host"
        )}/api/v1/users/reset-password/${token}`;
        const firstName = user.fullName.split(" ")[0];

        // Prepare and send reset email
        const mailOptions = {
            email: user.email,
            subject: "Reset Password",
            html: resetPasswordMail(link, firstName),
        };

        await sendMail(mailOptions);

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

        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: "Account not found",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message:
                "Password reset successfully. You can now log in with your new password.",
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

exports.changePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { password, newPassword, confirmPassword } = req.body;

        if (!password || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message:
                    "Please provide the current password, newPassword, and confirmPassword",
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!user.isLoggedIn) {
            return res.status(401).json({
                message: "Authentication Failed: User is not logged in",
            });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);
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

        user.password = hashedPassword;
        await user.save();

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

        const user = await User.findOne({ where: { email: email.toLowerCase() } });

        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }

        user.isLoggedIn = false;
        await user.save();

        res.status(200).json({
            message: "User logged out successfully",
        });
    } catch (error) {
        console.error("Error logging out:", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

exports.deleteUserAccount = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.profileImage) {
            try {
                const publicId = user.profileImage.split("/").pop().split(".")[0];

                await cloudinary.uploader.destroy(publicId);

            } catch (imageDeleteError) {
                console.error("Error deleting image:", imageDeleteError.message);
                return res.status(500).json({
                    message: "Error deleting profile image",
                });
            }
        }

        await user.destroy();

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

// USER DASHBOARD
exports.getOneUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ userId, include })
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        };


    } catch (error) {

    }
}

// MANAGE BOOKINGS (GET ALL BOOKINGS FOR A USER)
exports.manageBookings = async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        };

        const userBookings = await Booking.findAll({ where: { userId } });

        if (userBookings.length === 0) {
            return res.status(200).json({
                message: "No active booking for this user"
            })
        };

        res.status(200).json({
            message: "all bookings for this user",
            data: userBookings
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error Fetching Spaces by Host",
            data: error.message,
        });
    }
}