const joi = require("joi");

exports.registerValidator = (req, res, next) => {
  const schema = joi.object({
    fullName: joi.string().trim().min(3).pattern(/^[A-Za-z\s]+$/).required().messages({
      "any.required": "Full name is required.",
      "string.empty": "Full name cannot be empty.",
      "string.min": "Full name must be at least 5 characters long.",
      "string.pattern.base":
        "Full name cannot contain numbers or special characters.",
    }),

    email: joi.string().email().trim().required().messages({
      "any.required": "Email is required.",
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email cannot be empty.",
    }),
    password: joi.string().trim().min(6).required().messages({
      "any.required": "Password is required.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password must be at least 6 characters long.",
    }),
    confirmPassword: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({
        "any.only": "Confirm Password must match Password",
        "any.required": "confirm password is required",
        "string.empty": "confirm password cannot be empty.",
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation errors occurred.",
      errors: error.details.map((detail) => detail.message), // Collect all error messages.
    });
  }
  next();
};

exports.registerHostValidator = (req, res, next) => {
  const schema = joi.object({
    fullName: joi.string().trim().min(5).pattern(/^[A-Za-z\s]+$/).required().messages({
      "any.required": "Full name is required.",
      "string.empty": "Full name cannot be empty.",
      "string.min": "Full name must be at least 5 characters long.",
      "string.pattern.base":
        "Full name cannot contain numbers or special characters.",
    }),

    email: joi.string().email().trim().required().messages({
      "any.required": "Email is required.",
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email cannot be empty.",
    }),
    password: joi.string().trim().min(6).required().messages({
      "any.required": "Password is required.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password must be at least 6 characters long.",
    }),
    confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
      "any.only": "Confirm Password must match Password",
      "any.required": "confirm password is required",
      "string.empty": "confirm password cannot be empty.",
    }),
    companyName: joi.string().min(6).trim().required().messages({
      "any.required": "companyName is required.",
      "string.empty": "companyName cannot be empty.",
    }),
    companyAddress: joi.string().min(6).trim().regex(/[a-zA-Z]/).required().messages({
      "any.required": "companyAddress is required.",
      "string.empty": "companyAddress cannot be empty.",
      "string.pattern.base": "companyAddress must include at least one letter and cannot be only numbers."
    }),
    meansOfIdentification: joi.string().trim().valid("NIN", "Passport", "Driver's License").required().messages({
      "any.required": "Means of Identification is required.",
      "string.empty": "Means of Identification cannot be empty.",
      "any.only": "Means of Identification must be one of 'NIN', 'Passport', or 'Driver's License'."
    }),
    idCardNumber: joi.string()
      .trim()
      .required()
      .messages({
        "any.required": "idCardNumber is required.",
        "string.empty": "idCardNumber cannot be empty."
      }),
    ninImage: joi.string()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation errors occurred.",
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};

exports.loginValidator = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().trim().required().messages({
      "any.required": "Email is required.",
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email cannot be empty.",
    }),
    password: joi.string().trim().min(6).required().messages({
      "any.required": "Password is required.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password must be at least 6 characters long.",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation errors occurred.",
      errors: error.details.map((detail) => detail.message),
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
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation errors occurred.",
      errors: error.details.map((detail) => detail.message), // Collect all error messages.
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
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation errors occurred.",
      errors: error.details.map((detail) => detail.message), // Collect all error messages.
    });
  }
  next();
};

exports.addSpaceValidator = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().trim().min(3).required().messages({
      "string.empty": "Name cannot be empty.",
      "string.min": "Name must be at least 3 characters long.",
      "any.required": "Name is required.",
    }),
    overview: joi.string().trim().min(10).required().messages({
      "string.empty": "Overview cannot be empty.",
      "string.min": "Overview must be at least 10 characters long.",
      "any.required": "Overview is required.",
    }),
    pricePerHour: joi.number().integer().positive().required().messages({
      "number.base": "Price per hour must be a number.",
      "any.required": "Price per hour is required.",
    }),
    pricePerDay: joi.number().integer().positive().required().messages({
      "number.base": "Price per day must be a number.",
      "any.required": "Price per day is required.",
    }),
    capacity: joi.number().integer().positive().required().messages({
      "number.base": "Capacity must be a number.",
      "any.required": "Capacity is required.",
    }),
    amenities: joi.string().trim().required().messages({
      "string.empty": "Amenities cannot be empty.",
      "any.required": "Amenities are required.",
    }),
    availability: joi.string().required().invalid(" ").custom((value, helpers) => {
      try {
        JSON.parse(value);
        return value;
      } catch {
        return helpers.error("any.invalid");
      }
    }).messages({
      "any.required": "Availability is required.",
      "string.empty": "Availability cannot be empty.",
      "any.invalid": "Availability must be a valid JSON string.",
    }),
    spaceType: joi.string().required().messages({
      "any.required": "Space type is required.",
      "string.empty": "spaceType cannot be empty.",
    }),
    location: joi.string().trim().required().messages({
      "string.empty": "Location cannot be empty.",
      "any.required": "Location is required.",
    }),
    spaceAdress: joi.string().trim().required().messages({
      "string.empty": "Space address cannot be empty.",
      "any.required": "Space address is required.",
    }),
    averageRating: joi.number().min(0).max(5).messages({
      "number.base": "Average rating must be a number.",
      "number.min": "Average rating must be at least 0.",
      "number.max": "Average rating must not exceed 5.",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: error.message
    });
  }

  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "Please upload images for this space" });
  }

  const allowedTypes = "image/";
  const validFiles = files.filter(file => file.mimetype.startsWith(allowedTypes));

  if (validFiles.length === 0 || validFiles.length > 5) {
    return res.status(400).json({
      message: "Please upload only valid image types.",
    });
  }

  next();
};


// const Joi = require("joi");

// exports.addSpaceValidator = (req, res, next) => {
//   // 1. Validate body with Joi
//   const schema = Joi.object({
//     name: Joi.string().trim().min(3).required(),
//     overview: Joi.string().trim().min(10).required(),
//     pricePerHour: Joi.number().integer().positive().required(),
//     pricePerDay: Joi.number().integer().positive().required(),
//     capacity: Joi.number().integer().positive().required(),
//     amenities: Joi.string().trim().required(),
//     availability: Joi.string().required().custom((value, helpers) => {
//       try {
//         const parsed = JSON.parse(value);
//         if (!Array.isArray(parsed)) return helpers.error("any.invalid");
//         return value;
//       } catch (err) {
//         return helpers.error("any.invalid");
//       }
//     }),
//     spaceType: Joi.string().valid("cowork space", "creative spaces").required(),
//     location: Joi.string().trim().required(),
//     spaceAdress: Joi.string().trim().required(),
//   });

//   const { error } = schema.validate(req.body, { abortEarly: false });

//   // 2. Check body validation errors
//   if (error) {
//     return res.status(400).json({
//       message: "Validation errors occurred.",
//       errors: error.details.map((detail) => detail.message),
//     });
//   }

//   // 3. Validate image files
//   const files = req.files;

//   if (!files || files.length === 0) {
//     return res.status(400).json({ message: "At least one image is required." });
//   }

//   // const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
//   const allowedTypes = "image/";
//   // const invalidFiles = files.filter(file => !allowedTypes.includes(file.mimetype));
//   const validFiles = files.filter(file => file.mimetype.startsWith(allowedTypes));

//   if (validFiles.length = 0) {
//     return res.status(400).json({
//       message: "please upload only valid image types.",
//     });
//   }

//   next();
// };
