const{ verifyUser, login, forgottenPassword, resetPassword, changePassword, loggedOut, registerUser} = require('../controllers/userController');
const { authenticate } = require('../middleware/authentication');
const { registerValidator, loginValidator, changePasswordValidator } = require('../middleware/validator');

const router = require('express').Router(); 

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints related to user registration
 */

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the user
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *                 example: jane.doe@gmail.com
 *               password:
 *                 type: string
 *                 description: Password for the user
 *                 example: Password123!
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm the user's password
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: Account registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account registered successfully. Please check your email for verification.
 *                 data:
 *                   type: object
 *                   description: User details
 *       400:
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Passwords do not match
 *       500:
 *         description: Server error during registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error registering user
 */

router.post('/users/register',registerValidator, registerUser);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints related to user verification
 */

/**
 * @swagger
 * /api/v1/users/verify/{token}:
 *   get:
 *     summary: Verify a user's account
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent to the user's email
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account verified successfully"
 *       400:
 *         description: Bad request or session expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session expired: A new link has been sent to your email address."
 *       404:
 *         description: Account not found or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Server error during verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error verifying user"
 */


router.get("/users/verify/:token", verifyUser);


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints related to user authentication
 */

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Log in to a user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *                 example: jane.doe@gmail.com
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Account successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account successfully logged in"
 *                 data:
 *                   type: object
 *                   description: User details
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Incorrect password"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.post("/users/login",loginValidator, login);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints related to user account recovery
 */

/**
 * @swagger
 * /api/v1/users/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user requesting password reset
 *                 example: jane.doe@gmail.com
 *     responses:
 *       200:
 *         description: Password reset link sent to the user's email address
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
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Server error during password recovery
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forgotten password failed"
 */

router.post("/users/forgot-password", forgottenPassword);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints related to password management
 */

/**
 * @swagger
 * /api/v1/users/reset-password/{token}:
 *   post:
 *     summary: Reset a user's password
 *     tags: [Users]
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
 *                 description: The new password for the user
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
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Server error during password reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error resetting password"
 */

router.post("/users/reset-password/:token", resetPassword);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints related to password management
 */

/**
 * @swagger
 * /api/v1/users/change-password/{userId}:
 *   patch:
 *     summary: Change a user's password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose password needs to be changed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The current password of the user
 *                 example: OldPassword123!
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
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
 *         description: Bad request or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "New passwords do not match"
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authentication Failed: User is not logged in"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error during password change
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error changing password"
 */

router.patch("/users/change-password/:userId",authenticate, changePasswordValidator, changePassword);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints related to user session management
 */

/**
 * @swagger
 * /api/v1/users/logout:
 *   patch:
 *     summary: Log out a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user who wants to log out
 *                 example: jane.doe@gmail.com
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully"
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
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User does not exist"
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

router.patch("/users/logout", loggedOut);


module.exports = router;