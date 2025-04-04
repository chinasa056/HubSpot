const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin } = require("../controllers/admin");
const { registerUserValidator, loginValidator, registerValidator } = require("../middleware/validator");

router.post("/admin/register",registerValidator, registerAdmin);

router.post("/admin/login",loginValidator, loginAdmin);


module.exports = router;
