const { registerHost, verifyHost, loginHost, forgottenPasswordHost, resetPasswordHost, changePasswordHost, loggedOutHost, updateHostDetails, deleteHostAccount, getSpacesByHost, getBookingCategories, manageListing, getSpaceBookings } = require('../controllers/hostController');

const { authenticate, hostAuth } = require('../middleware/authentication');
const { loginValidator, resetPasswordValidator, changePasswordValidator, registerHostValidator } = require('../middleware/validator');

const upload = require("../utils/multer")

const router = require('express').Router();

router.post('/host/register', upload.single("ninImage"), registerHostValidator, registerHost);

router.get("/host/verify/:token", verifyHost);

router.post("/host/login", loginValidator, loginHost);

/**
 * @swagger
 * tags:
 *   name: Hosts
 *   description: Endpoints related to host account recovery
 */

/**
 * @swagger
 * /api/v1/host/forgot-password:
 *   post:
 *     summary: Request a password reset link for a host
 *     tags: [Hosts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the host requesting the password reset
 *                 example: host.email@company.com
 *     responses:
 *       200:
 *         description: Password reset link sent to the host's email address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A password reset link has been sent to your email address"
 *       400:
 *         description: Missing or invalid email address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please provide your email address"
 *       404:
 *         description: Host account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Internal server error during password recovery
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forgotten password failed"
 */

router.post("/host/forgot-password", forgottenPasswordHost);

/**
 * @swagger
 * tags:
 *   name: Hosts
 *   description: Endpoints related to host password management
 */

/**
 * @swagger
 * /api/v1/host/reset-password/{token}:
 *   post:
 *     summary: Reset a host's password
 *     tags: [Hosts]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token received for resetting the password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password for the host
 *                 example: NewPassword123!
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the new password
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully. You can now log in with your new password."
 *       400:
 *         description: Bad request or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Passwords do not match"
 *       404:
 *         description: Host account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Internal server error during password reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error resetting password"
 */

router.post("/host/reset-password/:token", resetPasswordValidator, resetPasswordHost);

/**
 * @swagger
 * tags:
 *   name: Hosts
 *   description: Endpoints related to host password management
 */

/**
 * @swagger
 * /api/v1/host/change-password/{userId}:
 *   patch:
 *     summary: Change a host's password
 *     tags: [Hosts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the host whose password needs to be changed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The current password of the host
 *                 example: OldPassword123!
 *               newPassword:
 *                 type: string
 *                 description: The new password for the host
 *                 example: NewPassword123!
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the new password
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Validation error or incorrect current password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "New passwords do not match"
 *       401:
 *         description: Authentication failed (host not logged in)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authentication Failed: Host is not logged in"
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
 *         description: Internal server error during password change
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error changing password"
 */

router.patch("/host/change-password/:userId", authenticate, changePasswordValidator, changePasswordHost);

/**
 * @swagger
 * tags:
 *   name: Hosts
 *   description: Endpoints related to host session management
 */

/**
 * @swagger
 * /api/v1/host/logout:
 *   patch:
 *     summary: Log out a host
 *     tags: [Hosts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the host who wants to log out
 *                 example: host.email@company.com
 *     responses:
 *       200:
 *         description: Host logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host logged out successfully"
 *       400:
 *         description: Email address is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *       404:
 *         description: Host does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host does not exist"
 *       500:
 *         description: Internal server error during logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.patch("/host/logout", hostAuth, loggedOutHost);

router.put('/host/update/:hostId', upload.single('profileImage'), hostAuth, updateHostDetails);

router.delete('/host/delete/:hostId', hostAuth, deleteHostAccount);

router.get("/host/getspaces/", hostAuth, getSpacesByHost);

router.get("/host/listings", hostAuth, manageListing);

router.get("/host/spacebookings/:spaceId", hostAuth, getSpaceBookings);

router.get("/host/bookingcategories/:hostId", hostAuth, getBookingCategories);

module.exports = router;