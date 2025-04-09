const{ verifyUser, login, forgottenPassword, resetPassword, changePassword, loggedOut, registerUser, logOut, manageBookings, updateUser, deleteUserAccount} = require('../controllers/userController');
const { authenticate } = require('../middleware/authentication');
const { registerValidator, loginValidator, changePasswordValidator } = require('../middleware/validator');

const router = require('express').Router(); 
/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user and admin
 *     description: Allows a user to create an account by providing personal details and an optional profile image.
 *     tags: [Users, Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional profile image upload
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
 *                   description: User object
 *       400:
 *         description: Bad request, validation error (e.g. passwords don't match or user already exists)
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
 *     summary: Login a user
 *     description: Authenticates a user using email and password. The account must be verified before login is allowed.
 *     tags: [Users, Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Registered user's email
 *                 example: jane.doe@gmail.com
 *               password:
 *                 type: string
 *                 description: Password for the user
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account successfully logged in
 *                 data:
 *                   type: object
 *                   description: Logged in user details
 *                 token:
 *                   type: string
 *                   description: JWT token for session authentication
 *       400:
 *         description: Missing credentials, incorrect password, or unverified account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account is not verified. Please check your email for the verification link.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post("/users/login",loginValidator, login);

/**
 * @swagger
 * /api/v1/users/forgot-password:
 *   post:
 *     summary: Send a password reset link
 *     description: Sends a password reset email to the user with a tokenized link. The user must exist in the database.
 *     tags: [Users, Admin]
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
 *     tags: [Users, Admin]
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
router.post("/users/reset-password/:token", resetPassword);
/**
 * @swagger
 * /api/v1/users/change-password/{userId}:
 *   patch:
 *     summary: Change the password for a user
 *     description: |
 *       This endpoint allows a logged-in user to change their password by providing the 
 *       current password, new password, and confirming the new password. The user needs 
 *       to be authenticated and provide the correct current password to proceed. 
 *       The new password and confirmation must match.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user changing the password.
 *         schema:
 *           type: integer
 *           example: 12345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The current password of the user.
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "newPassword123"
 *               confirmPassword:
 *                 type: string
 *                 description: A confirmation of the new password.
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password successfully changed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Bad request, e.g., incorrect current password or new passwords do not match.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Current password is incorrect"
 *       401:
 *         description: Authentication failed, user not logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authentication Failed: User is not logged in"
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
 *       500:
 *         description: Server error while changing the password.
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
 *     summary: Delete a user account
 *     description: Deletes a user account and their associated profile image from the system.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *           example: "12345"
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
 *       400:
 *         description: Bad request due to missing user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User ID is required"
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
 *         description: Server error during deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting user account"
 */

router.delete("/users/delete", authenticate, deleteUserAccount)



module.exports = router;