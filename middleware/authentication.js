const User = require("../models/user");
const Host = require("../models/host");
const jwt = require('jsonwebtoken');

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

exports.hostAuth = async (req, res, next) => {
  try {
      const auth = req.headers.authorization?.split(' ')[1];
      if (!auth) {
          return res.status(401).json({
              message: "Token not found"
          })
      };

      const payload = await jwt.verify(auth, process.env.JWT_SECRET, (error, payload) => {
          if (error) {
              return res.status(401).json({
                  message: 'Session expired'
              })
          } else {
              return payload
          }
      });

      const host = await Host.findByPk(payload.userId);
      if (!host) {
          return res.status(404).json({
              message: 'Authentication Failed: host not found'
          })
      };

      if(host.role !== "host") {
        return res.status(404).json({
          message: 'Authentication Failed: access granted to hosts only'
      })
      };

      req.user = payload;

      next();

  } catch (error) {
      return res.status(500).json({ message: 'Error authenticating user: ' + error.message })
  }
};


// exports.isAdmin = async (req, res, next) => {
//     try {
//         if (!req.user.isAdmin) {
//             return res.status(403).json({
//                 message: 'Unauthorized: User is not an Admin'
//             })
//         } else{
//             next();
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error authenticating Admin: ' + error.message })
//     }
// }
