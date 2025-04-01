const{ verifyUser, login, forgottenPassword, resetPassword, changePassword, loggedOut, registerUser} = require('../controllers/userController');
const { authenticate } = require('../middleware/authentication');
const { registerUserValidator, loginValidator, changePasswordValidator } = require('../middleware/validator');

const router = require('express').Router(); 

router.post('/users/register',registerUserValidator, registerUser);

router.get("/users/verify/:token", verifyUser);

router.post("/users/login",loginValidator, login);

router.post("/users/forgot-password", forgottenPassword);

router.post("/users/reset-password/:token", resetPassword);

router.patch("/users/change-password/:userId",authenticate, changePasswordValidator, changePassword);

router.patch("/users/logout", loggedOut);


module.exports = router;