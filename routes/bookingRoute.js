const { bookSpaceByHour, verifyBookingPerhour, bookSpaceByDay, verifyBookingPerDay } = require("../controllers/bookingController");
const { authenticate } = require("../middleware/authentication");

const router = require("express").Router();

/**
 * @swagger
 * /api/v1/booking/initialize/{spaceId}:
 *   post:
 *     summary: Initialize booking for a space by hour
 *     description: Authenticated users can initialize a space booking for a specified number of hours. A payment link is generated using Korapay.
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the space to be booked
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               durationPerHour:
 *                 type: number
 *                 example: 2
 *                 description: Duration of the booking in hours
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-20"
 *                 description: Date when the booking will start
 *               checkinTime:
 *                 type: string
 *                 example: "10:00"
 *                 description: Time when the user will check in
 *     responses:
 *       201:
 *         description: Booking initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space booking for hour initialized successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: "bca923ff-f0c9-409e-bfd7-7aa72a1a83a3"
 *                     checkout_url:
 *                       type: string
 *                       example: "https://checkout.korapay.com/checkout/bca923ff-f0c9-409e"
 *                 booking:
 *                   type: object
 *                   description: Details of the created booking
 *       400:
 *         description: Invalid input or space unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space is not available for booking"
 *       404:
 *         description: User or space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Booking failed: User not found"
 *       500:
 *         description: Server error during booking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error booking space by hour"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */
router.post("/booking/initialize/:spaceId",authenticate, bookSpaceByHour)

/**
 * @swagger
 * /api/v1/booking/verify:
 *   get:
 *     summary: Verify hourly space booking
 *     description: Verifies the status of a space booking by checking payment status via Korapay. If successful, the booking status is updated, space capacity is adjusted, and notification emails are sent.
 *     tags: [Booking]
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment reference used to verify the booking
 *     responses:
 *       200:
 *         description: Booking verification completed (success or failure)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "booking verification is successful"
 *                 data:
 *                   type: string
 *                   example: "bca923ff-f0c9-409e-bfd7-7aa72a1a83a3"
 *       404:
 *         description: Booking, user, or space not found or already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     - "No booking found for this reference"
 *                     - "booking for this reference is already confirmed"
 *                     - "User not found for booking ID: abc123"
 *                     - "Booking Verification Failed: Space not found"
 *       500:
 *         description: Server error during verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error verifying booking by hour"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message here"
 */
router.get("/booking/verify", verifyBookingPerhour);

/**
 * @swagger
 * /api/v1/booking/day/initialize/{spaceId}:
 *   post:
 *     summary: Initialize a space booking per day
 *     description: Initializes a space booking for a specified number of days. It verifies the user and space, calculates total cost, and generates a payment link via Korapay.
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the space to be booked
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - durationPerDay
 *               - startDate
 *               - checkinTime
 *             properties:
 *               durationPerDay:
 *                 type: number
 *                 example: 3
 *                 description: Number of days the space is being booked
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-20"
 *                 description: Booking start date (YYYY-MM-DD)
 *               checkinTime:
 *                 type: string
 *                 example: "09:00"
 *                 description: Time of check-in for the booking (HH:mm)
 *     responses:
 *       201:
 *         description: Booking initialized successfully with payment reference and checkout URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space booking per day successfully initialized"
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: "djd02d9-48aa-b1b3-e3cc24b3"
 *                     checkout_url:
 *                       type: string
 *                       example: "https://checkout.korapay.com/checkout/xyz123"
 *                 booking:
 *                   type: object
 *                   description: Booking data object
 *       400:
 *         description: Space unavailable or invalid booking request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No available desks in this space"
 *       404:
 *         description: User or space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Booking failed: User not found"
 *       500:
 *         description: Internal server error during booking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error booking space by day"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.post("/booking/day/initialize/:spaceId", authenticate, bookSpaceByDay);

/**
 * @swagger
 * /api/v1/booking/day/verify:
 *   get:
 *     summary: Verify space booking per day
 *     description: Verifies the payment for a daily space booking using the provided reference. Updates booking and space details on success, and sends email notifications to the user.
 *     tags: [Booking]
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: The reference ID returned after initializing the booking/payment
 *     responses:
 *       200:
 *         description: Booking verified successfully or payment failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "booking verification is successful"
 *                 data:
 *                   type: string
 *                   example: "bk_2348af9e-ref123"
 *                 bookingDetails:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: "bk_2348af9e-ref123"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-04-20"
 *                     checkinTime:
 *                       type: string
 *                       example: "09:00"
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-23T09:00:00.000Z"
 *       404:
 *         description: Booking not found, already confirmed, or related user/space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No booking found for this reference"
 *       500:
 *         description: Internal server error during booking verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error verifying booking per day"
 *                 error:
 *                   type: string
 *                   example: "Unexpected error occurred"
 */
router.get("/booking/day/verify", verifyBookingPerDay)

module.exports = router