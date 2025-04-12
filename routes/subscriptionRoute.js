const { initializeSubscription, verifySubscription, initializePremiumSubscription, verifyPremiumSubscription } = require('../controllers/subscriptionController');
const {hostAuth } = require('../middleware/authentication');

const router = require('express').Router();

router.post("/subscription/initialize", hostAuth, initializeSubscription);

router.get("/subscription/verify", verifySubscription);

router.post("/subscription/premium/initialize", hostAuth, initializePremiumSubscription);

router.get("/subscription/premium/verify", verifyPremiumSubscription)

// router.patch("/subscription/expired", checkSubscriptionStatus);


module.exports = router