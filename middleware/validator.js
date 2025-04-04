const joi = require("joi");

exports.registerValidator = (req, res, next) => {
    const schema = joi.object({
        fullName: joi.string().trim().min(5).pattern(/^[A-Za-z\s]+$/).required().messages({
            "any.required": "Full name is required.",
            "string.empty": "Full name cannot be empty.",
            "string.min": "Full name must be at least 5 characters long.",
            "string.pattern.base": "Full name cannot contain numbers or special characters."
        }),
        
        email: joi.string().email().required().messages({
            "any.required": "Email is required.",
            "string.email": "Please provide a valid email address.",
            "string.empty": "Email cannot be empty."
        }),
        password: joi.string().min(6).required().messages({
            "any.required": "Password is required.",
            "string.empty": "Password cannot be empty.",
            "string.min": "Password must be at least 6 characters long.",
        }),
        confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
            "any.only": "Confirm Password must match Password",
            "any.required": "confirm password is required",
            "string.empty": "confirm password cannot be empty.",
        })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: "Validation errors occurred.",
            errors: error.details.map(detail => detail.message) // Collect all error messages.
        });
    }
    next();
};

exports.loginValidator = (req, res, next) => {
    const schema = joi.object({       
        email: joi.string().email().required().messages({
            "any.required": "Email is required.",
            "string.email": "Please provide a valid email address.",
            "string.empty": "Email cannot be empty."
        }),
        password: joi.string().min(6).required().messages({
            "any.required": "Password is required.",
            "string.empty": "Password cannot be empty.",
            "string.min": "Password must be at least 6 characters long.",
        })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: "Validation errors occurred.",
            errors: error.details.map(detail => detail.message) 
        });
    }
    next();
};

exports.changePasswordValidator = (req, res, next) => {
    const schema = joi.object({
        password: joi.string().min(6).required().messages({
            "any.required": "Password is required.",
            "string.empty": "Password cannot be empty.",
            "string.min": "Password must be at least 6 characters long.",
        }),
        newPassword: joi.string().min(6).required().messages({
            "any.required": "Password is required.",
            "string.empty": "Password cannot be empty.",
            "string.min": "Password must be at least 6 characters long.",
        }),
        confirmPassword: joi.string().valid(joi.ref("newPassword")).required().messages({
            "any.only": "Confirm Password must match Password",
            "any.required": "confirm password is required",
            "string.empty": "confirm password cannot be empty.",
        })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: "Validation errors occurred.",
            errors: error.details.map(detail => detail.message) // Collect all error messages.
        });
    }
    next();
};

exports.resetPasswordValidator = (req, res, next) => {
    const schema = joi.object({
        newPassword: joi.string().min(6).required().messages({
            "any.required": "Password is required.",
            "string.empty": "Password cannot be empty.",
            "string.min": "Password must be at least 6 characters long.",
        }),
        confirmPassword: joi.string().valid(joi.ref("newPassword")).required().messages({
            "any.only": "Confirm Password must match Password",
            "any.required": "confirm password is required",
            "string.empty": "confirm password cannot be empty.",
        })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: "Validation errors occurred.",
            errors: error.details.map(detail => detail.message) // Collect all error messages.
        });
    }
    next();
};