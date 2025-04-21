// const crypto = require('crypto');
// const Payment = require('../models/payment');
// const Host = require('../models/host');

// const korapaySecretKey = process.env.KORAPAY_SECRET_KEY;

// exports.korapayWebhook = async (req, res) => {
//   try {
//     const signature = req.headers['x-korapay-signature'];
//     const expectedSignature = crypto
//       .createHmac('sha256', korapaySecretKey)
//       .update(JSON.stringify(req.body.data))
//       .digest('hex');

//     if (signature !== expectedSignature) {
//       console.warn('Invalid KoraPay webhook signature');
//       return res.status(401).json({ message: 'Unauthorized webhook request' });
//     }

//     const { event, data } = req.body;

//     // We're only interested in transfer events
//     if (!['transfer.success', 'transfer.failed'].includes(event)) {
//       return res.status(200).json({ message: 'Event ignored' });
//     }

//     const payment = await Payment.findOne({ where: { reference: data.reference } });

//     if (!payment) {
//       console.warn(`Payment with reference ${data.reference} not found`);
//       return res.status(404).json({ message: 'Payment record not found' });
//     }

//     const host = await Host.findByPk(payment.hostId);
//     if (!host) {
//       console.warn(`Host with ID ${payment.hostId} not found`);
//       return res.status(404).json({ message: 'Host not found' });
//     }

//     if (event === 'transfer.success') {
//       payment.status = 'success';
//       await payment.save();

//       // Deduct balance (Kobo to Naira conversion)
//       const nairaAmount = data.amount / 100;
//       host.currentBalance = Math.max(0, host.currentBalance - nairaAmount);
//       await host.save();

//       console.log(`✅ Payout successful. Host balance updated. Ref: ${data.reference}`);
//     }

//     if (event === 'transfer.failed') {
//       payment.status = 'failed';
//       await payment.save();

//       console.log(`❌ Payout failed. Ref: ${data.reference}`);
//     }

//     return res.status(200).json({ message: 'Webhook processed successfully' });

//   } catch (err) {
//     console.error('Error processing Kora webhook:', err.message);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // ROUTE
// const express = require('express');
// const router = express.Router();
// const { korapayWebhook } = require('../controllers/korapayWebhook');

// router.post('/webhook', express.json({ type: '*/*' }), korapayWebhook);

// module.exports = router;


// // https://yourdomain.com/api/korapay/webhook
