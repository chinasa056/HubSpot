const{register, verifyUser, login, forgottenPassword, resetPassword, changePassword, loggedOut} = require('../controllers/userController')

const router = require('express').Router(); 

router.post('/register-user', register);

router.get("/user/verify", verifyUser);

router.post("/user/login", login);

router.post("/user/forgot-password", forgottenPassword);

router.post("/users/reset-password/:token", resetPassword);

router.patch("/users/change-password/:userId", changePassword);

router.patch("/users/logout", loggedOut);


module.exports = router;