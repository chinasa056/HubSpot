const{register} = require('../controllers/userController')

const router = require('express').Router(); 
router.post('/register-user', register);



module.exports = router;