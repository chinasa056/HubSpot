const{ verify, login, forgottenPassword, resetPassword, changePassword, loggedOut, register} = require('../controllers/hostController');
const { authenticate } = require('../middleware/authentication');
const { registerValidator, loginValidator, changePasswordValidator } = require('../middleware/validator');

const router = require('express').Router(); 

router.post('/host/register',registerValidator, register);

router.get("/host/verify/:token", verify);

router.post("/host/login",loginValidator, login);

router.post("/host/forgot-password", forgottenPassword);

router.post("/host/reset-password/:token", resetPassword);

router.patch("/host/change-password/:userId",authenticate, changePasswordValidator, changePassword);

router.patch("/host/logout", loggedOut);


module.exports = router;