const express = require('express');
const { korapayWebhook } = require('../controllers/payoutController');
const router = express.Router();

router.post('/korapay/webhook', korapayWebhook);

// "https://hubspot-k95r.onrender.com/api/v1/korapay/webhook"


module.exports = router;
