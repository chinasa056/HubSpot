const { initializeSubscription, verifySubscription, checkSubscriptionStatus } = require('../controllers/subscriptionController');
const {hostAuth } = require('../middleware/authentication');

const router = require('express').Router();

router.post("/subscription/initialize/:planId", hostAuth,initializeSubscription )

router.get("/subscription/verify", verifySubscription);

router.patch("/subscription/expired", checkSubscriptionStatus)

module.exports = router