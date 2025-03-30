const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
<<<<<<< HEAD
const { mailTemplate, resetpassword } = require("../utils/mailTemplate");
const sendEmail = require("../middleWare/nodemailer");
const { validate } = require('../middleware/validator')
const fs = require('fs');

exports.register = async (req, res) => {
  try {
    const validated = await validate(req.body , registerSchema)
    const { fullName, email, username, password } = validated;
    const existingUser = await userModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      fs.unlinkSync(req.file.path)
      return res.status(400).json({
        message: `user with ${email} already exist `,
      });
    }
     
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const profile = await coludinary.uploader.uploads(req.file.path,{resource_type:'photo'},(error,data)=>{
      if(error){
        return res.status(400).json({
          message:error.message
        })
      }else{
        return data
      }
     });
    
    const user = new userModel({
      fullName,
      email,
      username,
      password: hashedPassword,
      profilePicture:profile.secure_url
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1day",
    });

    const link = `${token}`;
    // const link = `http://localhost:5173/verify-email/${token}`

    const firstName = user.fullName.split(" ")[0];

    const mailDetails = {
      subject: "Email Verification",
      email: user.email,
      html: mailTemplate(link, firstName),
    };
    await sendEmail(mailDetails);

    await user.save();

    res.status(201).json({
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    if(req.file.path){
      fs.unlinkSync(req.file.path)
    }
    res.status(500).json({
      message: "Error creating User"+error.message,
    });
  }
};

exports.verify = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user.isVerified === true) {
      return res.status(400).json({
        message: "user has already been verified",
      });
    }
    user.isVerified = true;

    await user.save();

    res.status(200).json({
      message: "User verified successfully",
    });
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "verification link expired",
      });
    }
    res.status(500).json({
      message: "Error Verifying User",
      error: error.message,
    });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const validated = await validate(req.body, verificationEmailSchema);
    const { email } = validated;

    if (!email) {
      return res.status(400).json({
        message: "please enter email address",
      });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const link = `${req.protocol}://${req.get("host")}/api/v1/${token}`;

    const firstName = user.fullName.split("")[1];
    // const html = sendEmail(link, firstName)

    const mailOptions = {
      subject: "email verification",
      email: user.email,
      html: resetpassword(link, firstName),
    };

    await sendEmail(mailOptions);

    res.status(200).json({
      message: "verification email sent, please check mail box",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "error resending verification email" + error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const validated = await validate(req.body, loginSchema);
    const { email, password } = validated;

    if (!email) {
      return res.status(400).json({
        message: "Please input email",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Please input password",
      });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (isCorrectPassword === false) {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }

    if (user.isVerified === false) {
      return res.status(400).json({
        message: "account is not verify, please check your email for link",
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1day",
    });

    res.status(200).json({
      message: "Account Successfully Logged In",
      data: user,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const validated = await validate(req.body, forgotPasswordSchema);
    const { email } = validated;

    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1min",
    });
    const link = `${token}`; //consumed link from frontend
    const firstName = user.fullName.split(" ")[0];

    const mailDetails = {
      subject: "FORGOT PASSWORD",
      email: user.email,
      html: resetpassword(link, firstName),
    };

    await sendEmail(mailDetails);
    return res.status(200).json({
      message: "Link has been sent to email address",
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      message: "forgot password failed",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }
    const validated = await validate(req.body, resetPasswordschema);

    const { password, confirmPassword } = validated;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password does not match",
      });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: "Session expired. Please enter your email to resend link",
      });
    }
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

exports.getOneUser = async (req, res) =>{
    try {
        const {id} = req.params

        const user = await userModel.findById(id);
=======
const { verify, reset } = require("../utils/mailTemplate");
const { send_mail } = require("../middleware/nodemailer");
// const cloudinary = require("../config/cloudinary")
// const fs = require('fs')

// const { validate } = require('../helper/utilities')
// const { registerSchema, loginSchema, verificationEmailSchema, forgotPasswordSchema, resetPasswordschema } = require('../validation/user')


exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, gender, password, confirmPassword } = req.body;
        const userExists = await userModel.findOne({ where: { email: email.toLowerCase() } });
        if (userExists) {
            // Unlink the file from our local storage
            fs.unlinkSync(req.file.path)
            return res.status(400).json({
                message: `User with email: ${email} already exists`
            })
        };
        if (!fullName || !email || !gender || !password || !confirmPassword) {
            return res.status(400).json({
                message: 'Input required for all field'
            })
        };
  
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Password does not match'
            })
        };
        const saltedRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltedRound);

        
        const user = new userModel({
            fullName,
            email,
            gender,
            password: hashedPassword,
        });

        const token = jwt.sign({where:{userId: user._id} }, process.env.JWT_SECRET, { expiresIn: '1day' });
        const link = `http://localhost:1189/verify-email/${token}`
        const firstName = user.fullName.split(' ')[0];

        const mailOptions = {
            email: user.email,
            subject: 'Account Verification',
            html: verify(link, firstName)
        };

        await send_mail(mailOptions);
        await user.save();
        res.status(201).json({
            message: 'Account registered successfully',
            data: user
        });
    } catch (error) {
        console.log(error.message);
        // if (req.file.path) {
        //     fs.unlinkSync(req.file.path)
        // }
        res.status(500).json({
            message: 'Error registering user'
        })
    }
};

exports.verifyUser = async (req, res) => {
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
                    const { userId } = jwt.decode(token);
                    const user = await userModel.findByPk(userId);

                    if (!user) {
                        return res.status(404).json({
                            message: 'Account not found'
                        })
                    };

                    if (user.isVerified === true) {
                        return res.status(400).json({
                            message: 'Account is verified already'
                        })
                    };

                    const newToken = jwt.sign({where:{userId: user._id }}, process.env.JWT_SECRET, { expiresIn: '5mins' });
                    const link = `${req.protocol}://${req.get('host')}/api/v1/verify/user/${newToken}`;
                    const firstName = user.fullName.split(' ')[0];

                    const mailOptions = {
                        email: user.email,
                        subject: 'Resend: Account Verification',
                        html: verify(link, firstName)
                    };

                    await send_mail(mailOptions);
                    res.status(200).json({
                        message: 'Session expired: Link has been sent to email address'
                    })
                }
            } else {
                const user = await userModel.findByPk(payload.userId);

                if (!user) {
                    return res.status(404).json({
                        message: 'Account not found'
                    })
                };

                if (user.isVerified === true) {
                    return res.status(400).json({
                        message: 'Account is verified already'
                    })
                };

                user.isVerified = true;
                await user.save();

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

        if (!email) {
            return res.status(400).json({
                message: "Please input email",
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Please input password",
            });
        }

        const user = await userModel.findOne({ where:{email: email.toLowerCase()} });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (isCorrectPassword === false) {
            return res.status(400).json({
                message: "Incorrect Password",
            });
        }

        if (user.isVerified === false) {
            return res.status(400).json({
                message: "account is not verify, please check your email for link",
            });
        }
        user.isLoggedIn = true
        const token = await jwt.sign({ userId: user._id, isLoggedIn: user.isLoggedIn }, process.env.JWT_SECRET, {
            expiresIn: "1day",
        });
        await user.save()
        res.status(200).json({
            message: "Account Successfully Logged In",
            data: user,
            token,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};


exports.forgettenPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ where:{email: email.toLowerCase() }});

        if (!user) {
            return res.status(404).json({
                message: 'Account not found'
            })
        };
        if (!user.isLoggedIn) {
            return res.status(401).json({
                message: "Authentication Failed: User is not logged in"
            });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5mins' });
        const link = `${req.protocol}://${req.get('host')}/api/v1/reset=password/user/${token}`;
        const firstName = user.fullName.split(' ')[0];

        const mailOptions = {
            email: user.email,
            subject: 'Reset Password',
            html: reset(link, firstName)
        };

        await send_mail(mailOptions);
        return res.status(200).json({
            message: 'Link has been sent to email address'
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Forgot password failed'
        })
    }
};



exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(404).json({
                message: "Token not found",
            });
        }

        const { newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'Password does not match'
            })
        };
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "Account not found",
            });
        }
        if (!user.isLoggedIn) {
            return res.status(401).json({
                message: "Authentication Failed: User is not logged in"
            });
        }
        const saltedRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltedRound);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successfully",
        });
    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: "Session expired. Please enter your email to resend link",
            });
        }
        res.status(500).json({
            message: "Error resetting password",
            error: error.message,
        });
    }
};


exports.changePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { password, newPassword, confirmPassword } = req.body;
        if (!password || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: 'Input all feild'
            })
        };

        const user = await userModel.findByPk(userId);

        if (!user.isLoggedIn) {
            return res.status(401).json({
                message: "Authentication Failed: User is not logged in"
            });
        }
>>>>>>> 86194bf (kelvin)

        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
<<<<<<< HEAD
        }

        res.status(200).json({
            message: 'user found',
            data: user
        })
        
    } catch (error) {
        console.log(error.message)        
      res.status(500).json({
        message: 'internal server error'
      })    
    }
};


exports.updateUser = async (req, res) =>{
  try {
    const {id} = req.params

    const user = await userModel.findById(id)
    if (!user) {
      return res.status(404).json({
        message: 'user not found'
      })
    }
    const { username} = req.body
    
    const data = { 
      username
    }
    const updatedUser = await userModel.findByIdAndUpdate(id, data, {new: true})
    res.status(200).json({
      message: 'User has been updated successfully ', 
      data:updatedUser
    })

  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'internal server error'
    })
  }
}
=======
        };

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword) {
            return res.status(400).json({
                message: 'incorrect password'
            })
        };

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'Password does not match'
            })
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: 'Password changed successfully'
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Error Changing Password'
        })
    }
}

exports.loggedOut = async (req, res) => {
    try {
        const { email } = req.body; // Extract email from request body

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await userModel.findOne({ where:{email: email.toLowerCase() }});

        if (!user) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        user.isLoggedIn = false;
        await user.save();

        return res.status(200).json({ message: 'User logged out successfully' });

    } catch (error) {
        console.error('Error logging out:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error' });
    }
};
>>>>>>> 86194bf (kelvin)
