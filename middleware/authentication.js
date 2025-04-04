const User = require("../models/user");
const jwt = require('jsonwebtoken');
const Admin = require("../models/admin");
const Host = require("../models/host");

exports.hostAuth = async (req, res, next) => {
  try {
      const auth = req.headers.authorization;
      if (!auth) {
          return res.status(400).json({
              message: "Token not found",
          });
      }
      const token = auth.split(" ")[1];
      if (!token) {
          return res.status(400).json({
              message: "Invalid token",
          });
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      let user;
      user = await User.findByPk(decodedToken.userId);
      if (user) {return res.status(403).json({
        message: "Unauthorized"
      })
    }
      if (!user) {
          user = await Host.findByPk(decodedToken.userId);
      }
      if (!user) {
        user = await Admin.findByPk(decodedToken.userId);
    }
      if (!user) {
          return res.status(404).json({
              message: "Authentication Failed: User not found",
          });
      }

      req.user = decodedToken;

      next();
  } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
          return res.status(403).json({
              message: "Session timed-out: Please login to continue",
          });
      }
      res.status(500).json({
          message: "Internal Server Error" + error.message,
      });
  }
};
exports.authenticate = async (req, res, next) => {
  try {
      const auth = req.headers.authorization;
      if (!auth) {
          return res.status(400).json({
              message: "Token not found",
          });
      }
      const token = auth.split(" ")[1];
      if (!token) {
          return res.status(400).json({
              message: "Invalid token",
          });
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      let user;
      user = await User.findByPk(decodedToken.userId);
      if (!user) {
          user = await Host.findByPk(decodedToken.userId);
      }
      if (!user) {
        user = await Admin.findByPk(decodedToken.userId);
    }
      if (!user) {
          return res.status(404).json({
              message: "Authentication Failed: User not found",
          });
      }

      req.user = decodedToken;

      next();
  } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
          return res.status(403).json({
              message: "Session timed-out: Please login to continue",
          });
      }
      res.status(500).json({
          message: "Internal Server Error" + error.message,
      });
  }
};

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.isAdmin === false) {
            return res.status(403).json({
                message: 'Unauthorized: User is not an Admin'
            })
        } else{
            next();
        }
    } catch (error) {
        res.status(500).json({ message: 'Error authenticating Admin: ' + error.message })
    }
}
