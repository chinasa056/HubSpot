const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isAdmin } = require("../middleware/authentication");

exports.registerAdmin = async (req, res) => {
    try {
        const { email, password, fullName, confirmPassword } = req.body;

        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({
                message: "Admin with this email already exists.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await Admin.create({
            email,
            password: hashedPassword,
            fullName,
        });

        res.status(201).json({
            message: "Admin registered successfully.",
            data: {
                id: newAdmin.id,
                email: newAdmin.email,
                fullName: newAdmin.fullName,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error registering admin.",
            data: error.message,
        });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({
                message: "Authentication failed: Admin not found.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Authentication failed: Incorrect password.",
            });
        }

        const token = jwt.sign(
            { userId: admin.id, email: admin.email, isAdmin: admin.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "2days" }
        );

        res.status(200).json({
            message: "Login successful.",
            token,
            admin: {
                userId: admin.id,
                isAdmin: admin.isAdmin,
                email: admin.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error logging in admin.",
            data: error.message,
        });
    }
};
