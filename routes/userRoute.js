const router = require('express').Router(); 
const passport = require("passport")
const jwt = require("jsonwebtoken")

const{ verifyUser, login, forgottenPassword, resetPassword, changePassword, registerUser, logOut, manageBookings, updateUser, deleteUserAccount} = require('../controllers/userController');
const { authenticate } = require('../middleware/authentication');
const { registerValidator, loginValidator, changePasswordValidator, resetPasswordValidator } = require('../middleware/validator');


/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user by accepting their full name, email, password, and confirmation password in JSON format. It checks for existing users, hashes the password, creates the user, and sends a verification email.
 *     tags: [Users, Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: User registered successfully and verification email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account registered successfully. Please check your email for verification."
 *                 
 *       400:
 *         description: Email already exists or passwords do not match.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Passwords do not match"
 *       500:
 *         description: Internal server error during registration.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error registering user"
 *                 data:
 *                   type: string
 *                   example: "Error message details"
 */
router.post('/users/register',registerValidator, registerUser);

/**
 * @swagger
 * /api/v1/users/verify/{token}:
 *   get:
 *     summary: Verify a user's email account
 *     description: Verifies the user's account using a JWT token sent to their email. If the token is expired, a new one is sent automatically.
 *     tags: [Users, Admin]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: JWT token sent via email for account verification
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account verified successfully or new verification email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account verified successfully
 *       400:
 *         description: Token is invalid or account is already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account is already verified
 *       404:
 *         description: Token is missing or account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account not found
 *       500:
 *         description: Internal server error during verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error verifying user
 */

router.get("/users/verify/:token", verifyUser);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user using email and password. Returns a token on successful login.
 *     tags: [Users, Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account successfully logged in"
 *                 data:
 *                   type: string
 *                   description: Full name of the logged in user
 *                   example: "Jane Doe"
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Bad request or unverified account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account is not verified. Please check your email for the verification link."
 *       404:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login Failed: Invalid Credentials"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Logging in User"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */

router.post("/users/login",loginValidator, login);

/**
 * @swagger
 * /api/v1/users/forgot-password:
 *   post:
 *     summary: Send a password reset link
 *     description: Sends a password reset email to the user with a tokenized link. The user must exist in the database.
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
 *                 description: Registered email address of the user
 *                 example: jane.doe@gmail.com
 *     responses:
 *       200:
 *         description: Reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A password reset link has been sent to your email address
 *       400:
 *         description: Email not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please provide your email address
 *       404:
 *         description: User account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account not found
 *       500:
 *         description: Server error while sending reset link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forgotten password failed
 */


router.post("/users/forgot-password", forgottenPassword);

/**
 * @swagger
 * /api/v1/users/reset-password/{token}:
 *   post:
 *     summary: Reset user password
 *     description: Resets a user's password using the token sent to their email. Password and confirmation must match.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token sent to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *                 example: NewSecurePassword123!
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the new password
 *                 example: NewSecurePassword123!
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
 *                   example: Password reset successfully. You can now log in with your new password.
 *       400:
 *         description: Bad request – missing fields, password mismatch, or invalid/expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Passwords do not match
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account not found
 *       500:
 *         description: Server error during password reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error resetting password
 */
router.post("/users/reset-password/:token",resetPasswordValidator, resetPassword);

/**
 * @swagger
 * /api/v1/users/change-password:
 *   patch:
 *     summary: Change user password
 *     description: >
 *       Allows an authenticated user to securely change their password.  
 *       - Requires the current password, a new password, and a confirmation of the new password.  
 *       - The system verifies the current password before allowing a change.  
 *       - New passwords must match for the update to be accepted.  
 *       - This route is **authenticated** and accessible only to logged-in users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newStrongPassword456"
 *               confirmPassword:
 *                 type: string
 *                 example: "newStrongPassword456"
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
 *         description: Validation or password mismatch error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Current password is incorrect"
 *       401:
 *         description: Unauthorized - user is not logged in
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error changing password"
 */
router.patch("/users/change-password",authenticate, changePasswordValidator, changePassword);

/**
 * @swagger
 * /api/v1/users/logout:
 *   patch:
 *     summary: Logout user
 *     description: Logs out a user by updating their login status to false.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
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
 *         description: Email is missing from the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User does not exist"
 *       500:
 *         description: Server error during logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error logging out user"
 */

router.patch("/users/logout", authenticate,logOut);
/**
 * @swagger
 * /api/v1/users/booking:
 *   get:
 *     summary: Get all bookings for the authenticated user
 *     description: |
 *       This endpoint retrieves all active bookings for the currently authenticated user. 
 *       A booking is associated with a user and contains details such as the booking ID, 
 *       space information, status, and booking date. If the user has no active bookings, 
 *       the response will indicate that no bookings are available. 
 *       The user must be authenticated and provide a valid bearer token to access this endpoint.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all bookings for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All bookings for this user"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bookingId:
 *                         type: integer
 *                         example: 123
 *                       bookingDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-04-09"
 *                       spaceId:
 *                         type: integer
 *                         example: 456
 *                       status:
 *                         type: string
 *                         example: "Active"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       204:
 *         description: No active bookings for this user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No active booking for this user"
 *       500:
 *         description: Server error while fetching bookings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching bookings"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */

router.get("/users/booking", authenticate, manageBookings);

/**
 * @swagger
 * /api/v1/users/update:
 *   patch:
 *     summary: Update user details
 *     description: Updates the user profile details, including profile image if provided.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updatedData:
 *                 type: object
 *                 description: The user details to update, excluding the profile image (unless provided as a file).
 *                 example:
 *                   fullName: "John Doe"
 *                   email: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 12345
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     profileImage:
 *                       type: object
 *                       properties:
 *                         imageUrl:
 *                           type: string
 *                           example: "https://example.com/profile.jpg"
 *                         publicId:
 *                           type: string
 *                           example: "public_id_12345"
 *       400:
 *         description: Bad request due to invalid data or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid data provided"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Update failed: user not found"
 *       500:
 *         description: Server error during user update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.patch("/users/update", authenticate, updateUser);

/**
 * @swagger
 * /api/v1/users/delete:
 *   delete:
 *     summary: Delete user account
 *     description: >
 *       Permanently deletes the authenticated user's account along with their profile image (if available).  
 *       - This route is **authenticated** and can only be accessed by a logged-in user.  
 *       - If the user has a profile image stored on Cloudinary, it will be removed before deleting the account.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User and profile image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User and profile image deleted successfully"
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
 *         description: Server error while deleting user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting user account"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.delete("/users/delete", authenticate, deleteUserAccount)


router.get("/authenticate", passport.authenticate("google", { scope: ['profile', "email"] }))

router.get("/users/login", passport.authenticate("google"), async (req, res) => {
    const token = await jwt.sign({userId: req.user.id, isAdmin: req.user.isAdmin, isLoggedIn: req.user.isLoggedIn}, process.env.JWT_SECRET, {expiresIn: "1day"})
    res.status(200).json({
        message: "Login Successful",
        data: req.user,
        token
    })
});


module.exports = router;