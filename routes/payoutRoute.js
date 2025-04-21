const { initiateHostPayout } = require("../controllers/payoutController");
const { hostAuth } = require("../middleware/authentication");

const router = require("express").Router();

router.post("/host/payout", hostAuth, initiateHostPayout)

module.exports = router