const {initializePremiumSubscription, verifyPremiumSubscription, initializeStandardSubscription, verifyStandardSubscription } = require('../controllers/subscriptionController');
const {hostAuth } = require('../middleware/authentication');

const router = require('express').Router();

/**
 * @swagger
 * /api/v1/subscription/initialize:
 *   post:
 *     summary: Initialize Standard Subscription
 *     description: Initiates a payment process for a Standard subscription using Korapay. Host must be authenticated.
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription initialized successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       description: Korapay payment reference
 *                       example: "KORA_REF_123456"
 *                     checkout_url:
 *                       type: string
 *                       description: URL to complete payment
 *                       example: "https://checkout.korapay.com/payment-link"
 *       400:
 *         description: Subscription already active
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You curently have an active Standard subscription, Would you like to upgrade to Premium?"
 *       404:
 *         description: Host not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host not found"
 *       500:
 *         description: Server error during subscription initialization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error subscribing"
 *                 data:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.post("/subscription/initialize", hostAuth, initializeStandardSubscription);

/**
 * @swagger
 * /api/v1/subscription/verify:
 *   get:
 *     summary: Verify Standard Subscription Payment
 *     description: Verifies the payment for a Standard subscription using the Korapay payment reference. If successful, it updates the host's subscription status.
 *     tags: [Host]
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         description: Korapay payment reference used to verify the transaction.
 *         schema:
 *           type: string
 *           example: "KORA_REF_123456"
 *     responses:
 *       200:
 *         description: Subscription verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription verified successfully"
 *       404:
 *         description: Host not found for the provided email from payment verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription failed: Host not found"
 *       500:
 *         description: Server error occurred during subscription verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error verifying subscription"
 */

router.get("/subscription/verify", verifyStandardSubscription);

/**
 * @swagger
 * /api/v1/subscription/premium/initialize:
 *   post:
 *     summary: Initialize Premium Subscription
 *     description: Initializes the payment process for upgrading to a Premium subscription. The request includes the payment amount and user details, and the response contains a payment reference and checkout URL.
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Premium subscription initialized successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription for Premium initialized successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       description: Korapay payment reference.
 *                       example: "KORA_REF_123456"
 *                     checkout_url:
 *                       type: string
 *                       description: URL for completing the payment.
 *                       example: "https://payment.korapay.com/checkout/KORA_REF_123456"
 *       400:
 *         description: Host already has an active Standard subscription.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You currently have an active Standard subscription, Would you like to upgrade to Premium?"
 *       404:
 *         description: Host not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host not found"
 *       500:
 *         description: Server error occurred while initializing subscription.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error subscribing"
 *                 data:
 *                   type: string
 *                   example: "Error details message"
 */
router.post("/subscription/premium/initialize", hostAuth, initializePremiumSubscription);

/**
 * @swagger
 * /api/v1/subscription/premium/verify:
 *   get:
 *     summary: Verify Premium Subscription
 *     description: Verifies the Premium subscription payment via Korapay using the provided payment reference.
 *     tags: [Host]
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: The Korapay payment reference to verify.
 *     responses:
 *       200:
 *         description: Premium subscription verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription for Premium verified successfully"
 *       404:
 *         description: Host not found or subscription verification failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription failed: Host not found"
 *       500:
 *         description: Server error occurred during subscription verification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error verifying subscription"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */

router.get("/subscription/premium/verify", verifyPremiumSubscription)

// router.patch("/subscription/expired", checkSubscriptionStatus);


module.exports = router