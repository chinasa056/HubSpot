const { createTest } = require("../controllers/test");
const { authenticate, isAdmin } = require("../middleware/authentication");

const router = require("express").Router()

router.post("/test/create", createTest)

module.exports = router