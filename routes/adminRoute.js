const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin } = require("../controllers/admin");
const { registerUserValidator, loginValidator } = require("../middleware/validator");

router.post("/admin/register",registerUserValidator, registerAdmin);

router.post("/admin/login",loginValidator, loginAdmin);


module.exports = router;
