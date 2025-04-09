const { initializeSubscription, verifySubscription, checkSubscriptionStatus } = require('../controllers/subscriptionController');
const {hostAuth } = require('../middleware/authentication');

const router = require('express').Router();

/**
 * @swagger
 * /api/v1/subscription/initialize/{planId}:
 *   post:
 *     summary: Initialize a subscription for a host
 *     description: This endpoint allows a host to initialize a subscription plan. It checks if the host is eligible for the subscription, verifies that the selected plan exists, and ensures the host does not already have an active subscription. If all checks pass, it initializes the subscription and provides payment details for the host to complete the transaction.
 *     tags: [Host]
 *     parameters:
 *       - name: planId
 *         in: path
 *         required: true
 *         description: The ID of the subscription plan the host wants to subscribe to.
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription initialized successfully. The response contains the payment reference and checkout URL for completing the subscription.
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
 *                       example: "sub-123456789"
 *                     checkout_url:
 *                       type: string
 *                       example: "https://payment-url.com"
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     hostId:
 *                       type: integer
 *                       example: 1
 *                     planId:
 *                       type: integer
 *                       example: 2
 *                     planName:
 *                       type: string
 *                       example: "Premium Plan"
 *                     amount:
 *                       type: number
 *                       format: float
 *                       example: 5000.00
 *                     reference:
 *                       type: string
 *                       example: "sub-123456789"
 *                     paymentDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-09T00:00:00Z"
 *       400:
 *         description: Host already has an active subscription or is pending a subscription.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You already have an active subscription. Please wait until it expires."
 *       404:
 *         description: Host or Plan not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host not found"
 *       500:
 *         description: Server error while initializing the subscription.
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
 *                   example: "Error message details"
 */
router.post("/subscription/initialize/:planId", hostAuth, initializeSubscription);

/**
 * @swagger
 * /api/v1/subscription/verify:
 *   get:
 *     summary: Verify a subscription payment
 *     description: This endpoint verifies the status of a subscription using a reference ID. It checks the payment status via the Korapay API, updates the subscription status accordingly, and sends a success or failure notification email to the host. If successful, the subscription's start and end dates are set, and the host is notified. If the payment fails, the subscription status is updated to "failed", and the host is notified of the failure.
 *     tags: [Host]
 *     parameters:
 *       - name: reference
 *         in: query
 *         required: true
 *         description: The reference ID of the subscription to verify.
 *         schema:
 *           type: string
 *           example: "sub-123456789"
 *     responses:
 *       200:
 *         description: Subscription verification completed successfully. The response includes a success message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription is successful"
 *       404:
 *         description: No subscription found for the given reference, or host not found for the subscription.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No subscription found for reference: sub-123456789"
 *       500:
 *         description: Server error while verifying the subscription or sending the email notifications.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error verifying subscription"
 */
router.get("/subscription/verify", verifySubscription);


/**
 * @swagger
 * /api/v1/subscription/expired:
 *   patch:
 *     summary: Check and update subscription statuses
 *     description: This endpoint checks all active subscriptions and updates their status to "expired" if the current date is past the subscription's end date. An email reminder is sent to the host if their subscription has expired, with details on how to renew. The check runs across all active subscriptions and sends an email notification for each expired subscription.
 *     tags: [Host]
 *     responses:
 *       200:
 *         description: Subscriptions checked, expired subscriptions updated, and email reminders sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription expired, email reminder sent"
 *       500:
 *         description: Server error occurred while checking or updating subscription status, or while sending email reminders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching subscription details"
 */
router.patch("/subscription/expired", checkSubscriptionStatus);


module.exports = router