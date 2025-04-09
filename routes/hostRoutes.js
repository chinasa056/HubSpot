const { registerHost, verifyHost, loginHost, forgottenPasswordHost, resetPasswordHost, changePasswordHost, loggedOutHost, updateHostDetails, deleteHostAccount, getSpacesByHost, getBookingCategories, manageListing, getSpaceBookings } = require('../controllers/hostController');

const { authenticate, hostAuth } = require('../middleware/authentication');
const { loginValidator, resetPasswordValidator, changePasswordValidator, registerHostValidator } = require('../middleware/validator');

const upload = require("../utils/multer")

const router = require('express').Router();
/**
 * @swagger
 * /api/v1/host/register:
 *   post:
 *     summary: Register a new host
 *     description: This endpoint registers a new host and sends a verification email after successful registration.
 *     tags: [Host]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *                 description: The full name of the host.
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "host@example.com"
 *                 description: The email address of the host.
 *               password:
 *                 type: string
 *                 example: "password123"
 *                 description: The password for the host's account.
 *               confirmPassword:
 *                 type: string
 *                 example: "password123"
 *                 description: Confirmation of the host's password.
 *               companyName:
 *                 type: string
 *                 example: "Tech Innovations Ltd."
 *                 description: The name of the company the host is associated with.
 *               companyAddress:
 *                 type: string
 *                 example: "123 Tech Street, Silicon Valley"
 *                 description: The address of the company.
 *               meansOfIdentification:
 *                 type: string
 *                 example: "National ID"
 *                 description: The means of identification for the host.
 *               idCardNumber:
 *                 type: string
 *                 example: "ID123456"
 *                 description: The ID card number of the host.
 *               ninImage:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the host's NIN card.
 *     responses:
 *       201:
 *         description: Host account created successfully and verification email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account registered successfully. Please check your email for verification."
 *                 data:
 *                   $ref: '#/components/schemas/Host'
 *       400:
 *         description: Invalid input, or passwords do not match, or host already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host with email: host@example.com already exists"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Registering User"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */
router.post('/host/register', upload.single("ninImage"), registerHostValidator, registerHost);


/**
 * @swagger
 * /api/v1/host/verify/{token}:
 *   get:
 *     summary: Verify a host account using a verification token
 *     description: This endpoint verifies the host account by validating the token sent to the host's email. If the token is expired or invalid, a new verification email is sent.
 *     tags: [Host]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The token sent to the host's email for verification.
 *         schema:
 *           type: string
 *           example: "sample_verification_token"
 *     responses:
 *       200:
 *         description: Account successfully verified or new verification link sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account verified successfully" 
 *       400:
 *         description: Invalid token or the account is already verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account is already verified"
 *       404:
 *         description: Host not found or the token is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error verifying host"
 */
router.get("/host/verify/:token", verifyHost);


/**
 * @swagger
 * /api/v1/host/login:
 *   post:
 *     summary: Host login
 *     description: This endpoint allows a host to log in by providing their email and password. If the account is not verified, an appropriate message is returned.
 *     tags: [Host]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "host@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Account successfully logged in.
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
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "host@example.com"
 *                     isLoggedin:
 *                       type: boolean
 *                       example: true
 *                 token:
 *                   type: string
 *                   example: "jwt.token.here"
 *       400:
 *         description: Missing email or password, incorrect password, or unverified account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Incorrect password"
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
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/host/login", loginValidator, loginHost);


/**
 * @swagger
 * /api/v1/host/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     description: This endpoint allows a host to request a password reset link by providing their registered email. If the host exists, a password reset link is sent to the email.
 *     tags: [Host]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "host@example.com"
 *     responses:
 *       200:
 *         description: A password reset link has been sent to the provided email address.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A password reset link has been sent to your email address"
 *       400:
 *         description: Missing email address in the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please provide your email address"
 *       404:
 *         description: Host account not found with the provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Internal server error while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forgotten password failed"
 *                 data:
 *                   type: string
 *                   example: "Error message details"
 */
router.post("/host/forgot-password", forgottenPasswordHost);


/**
 * @swagger
 * /api/v1/host/reset-password/{token}:
 *   post:
 *     summary: Reset host password using a valid token
 *     description: This endpoint allows a host to reset their password by providing a valid reset token and new password. The reset token is sent via email in response to a forgotten password request.
 *     tags: [Host]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The token sent to the host's email for password reset.
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "newPassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully. Host can log in with the new password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully. You can now log in with your new password."
 *       400:
 *         description: Invalid or expired token, or passwords do not match.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token is required" / "Passwords do not match" / "Session expired. Please request a new password reset link."
 *       404:
 *         description: Account not found with the provided token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Error occurred while processing the password reset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error resetting password"
 *                 data:
 *                   type: string
 *                   example: "Error message details"
 */
router.post("/host/reset-password/:token", resetPasswordValidator, resetPasswordHost);

/**
 * @swagger
 * /api/v1/host/change-password/{userId}:
 *   patch:
 *     summary: Change host password
 *     description: This endpoint allows a host to change their password by providing the current password, new password, and confirming the new password. The host must be authenticated and logged in.
 *     tags: [Host]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The unique identifier of the host whose password is to be changed.
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newPassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Validation errors, incorrect current password, or new passwords do not match.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Current password is incorrect" / "New passwords do not match"
 *       401:
 *         description: Host is not logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authentication Failed: Host is not logged in"
 *       404:
 *         description: Host account not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host not found"
 *       500:
 *         description: Server error while processing the password change.
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
 * /api/v1/host/logout:
 *   patch:
 *     summary: Log out a host
 *     description: This endpoint allows a host to log out by updating their login status to `false`. The host must be authenticated.
 *     tags: [Host]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "host@example.com"
 *     responses:
 *       200:
 *         description: Host logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host logged out successfully"
 *       400:
 *         description: Email is required in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *       404:
 *         description: Host does not exist for the provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host does not exist"
 *       500:
 *         description: Internal server error.
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

/**
 * @swagger
 * /api/v1/host/update/{hostId}:
 *   put:
 *     summary: Update host details
 *     description: This endpoint allows a host to update their personal details, including their profile image. The host must be authenticated.
 *     tags: [Host]
 *     parameters:
 *       - in: path
 *         name: hostId
 *         required: true
 *         description: The ID of the host whose details need to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               companyName:
 *                 type: string
 *                 example: "John's Company"
 *               companyAddress:
 *                 type: string
 *                 example: "123 Street, City, Country"
 *     responses:
 *       200:
 *         description: Host details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host details updated successfully"
 *                 data:
 *                   type: object
 *                   description: The updated host details
 *       400:
 *         description: Bad request (incorrect parameters).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input"
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
 *         description: Internal server error (error during the update process).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating host details"
 */
router.put('/host/update/:hostId', upload.single('profileImage'), hostAuth, updateHostDetails);


/**
 * @swagger
 * /api/v1/host/delete/{hostId}:
 *   delete:
 *     summary: Delete host account
 *     description: This endpoint allows an authenticated host to delete their account. It also deletes their profile image from Cloudinary.
 *     tags: [Host]
 *     parameters:
 *       - in: path
 *         name: hostId
 *         required: true
 *         description: The ID of the host whose account needs to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Host account and profile image deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User and profile image deleted successfully"
 *       404:
 *         description: Host not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "host not found"
 *       500:
 *         description: Internal server error (error during the account deletion process).
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
 *                   example: "Error details"
 */
router.delete('/host/delete/:hostId', hostAuth, deleteHostAccount);

/**
 * @swagger
 * /api/v1/host/getspaces/:
 *   get:
 *     summary: Retrieve all spaces for the authenticated host
 *     description: This endpoint allows the authenticated host to retrieve a list of all spaces they own. The user must be authenticated to access this endpoint. If the host has no spaces, a message indicating no spaces were found will be returned.
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of spaces that belong to the authenticated host.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Spaces Found for This Host"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the space.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The name of the space.
 *                         example: "Conference Room A"
 *                       location:
 *                         type: string
 *                         description: The location of the space.
 *                         example: "New York, NY"
 *                       capacity:
 *                         type: integer
 *                         description: The capacity of the space.
 *                         example: 50
 *                       price:
 *                         type: number
 *                         format: float
 *                         description: The price of renting the space per hour.
 *                         example: 100.00
 *                 count:
 *                   type: integer
 *                   description: The number of spaces owned by the host.
 *                   example: 3
 *       404:
 *         description: No spaces were found for the authenticated host.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Spaces Found for This Host"
 *       500:
 *         description: Internal server error occurred while retrieving spaces.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Fetching Spaces by Host"
 *                 data:
 *                   type: string
 *                   example: "Error details message"
 */
router.get("/host/getspaces/", hostAuth, getSpacesByHost);

/**
 * @swagger
 * /api/v1/host/listings:
 *   get:
 *     summary: Retrieve all space listings for a host
 *     description: This endpoint allows an authenticated host to retrieve all the spaces they have listed. The host must be authenticated to access this endpoint. It returns the list of spaces, including their `name`, `bookingCount`, `createdAt`, `capacity`, and `listingStatus`. If no spaces are listed for the host, a message will be returned indicating that there are no spaces listed.
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of space listings for the host.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space listings for this host"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the listed space.
 *                         example: "Conference Room A"
 *                       bookingCount:
 *                         type: integer
 *                         description: The total number of bookings for this space.
 *                         example: 5
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the space was listed.
 *                         example: "2025-04-01T12:00:00Z"
 *                       capacity:
 *                         type: integer
 *                         description: The capacity of the space (number of people it can accommodate).
 *                         example: 30
 *                       listingStatus:
 *                         type: string
 *                         description: The current status of the listing (e.g., active, suspended).
 *                         example: "active"
 *       400:
 *         description: The host has not listed any spaces.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No spaces listed for this host"
 *       404:
 *         description: The host was not found in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host not found"
 *       500:
 *         description: Internal server error occurred while fetching space listings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error categorizing bookings"
 *                 error:
 *                   type: string
 *                   example: "Error details message"
 */
router.get("/host/listings", hostAuth, manageListing);

/**
 * @swagger
 * /api/v1/host/spacebookings/{spaceId}:
 *   get:
 *     summary: Retrieve all bookings for a specific space
 *     description: This endpoint allows the authenticated host to retrieve all bookings associated with a particular space. The host must be authenticated to access this endpoint. The space is identified by its `spaceId`. If no bookings are found for the space, the response will contain an empty array.
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         description: The ID of the space to retrieve bookings for.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of bookings for the space.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space and bookings retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the space.
 *                       example: "Conference Room A"
 *                     bookings:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userName:
 *                             type: string
 *                             description: The name of the user who made the booking.
 *                             example: "John Doe"
 *                           startDate:
 *                             type: string
 *                             format: date-time
 *                             description: The start date and time of the booking.
 *                             example: "2025-05-01T09:00:00Z"
 *                           endDate:
 *                             type: string
 *                             format: date-time
 *                             description: The end date and time of the booking.
 *                             example: "2025-05-01T11:00:00Z"
 *                           status:
 *                             type: string
 *                             description: The status of the booking (e.g., confirmed, canceled).
 *                             example: "confirmed"
 *       404:
 *         description: The space with the given `spaceId` was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space not found"
 *       500:
 *         description: Internal server error occurred while fetching the space bookings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching space bookings"
 *                 error:
 *                   type: string
 *                   example: "Error details message"
 */
router.get("/host/spacebookings/:spaceId", hostAuth, getSpaceBookings);

/**
 * @swagger
 * /host/bookingcategories/{hostId}:
 *   get:
 *     summary: Retrieve categorized bookings for a specific host
 *     description: This endpoint allows the authenticated host to retrieve categorized bookings (upcoming, active, completed) associated with their spaces. The host must be authenticated to access this endpoint. If no bookings are found, the response will show counts of each category (upcoming, active, completed).
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hostId
 *         required: true
 *         description: The ID of the host to retrieve categorized bookings for.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: A summary of categorized bookings for the host.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bookings categorized successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     counts:
 *                       type: object
 *                       properties:
 *                         upcoming:
 *                           type: integer
 *                           description: The number of upcoming bookings for the host.
 *                           example: 5
 *                         active:
 *                           type: integer
 *                           description: The number of active bookings for the host.
 *                           example: 3
 *                         completed:
 *                           type: integer
 *                           description: The number of completed bookings for the host.
 *                           example: 7
 *       400:
 *         description: No spaces listed for this host or other validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No spaces listed for this host"
 *       404:
 *         description: Host not found or no bookings found for the host.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host not found"
 *       500:
 *         description: Internal server error occurred while categorizing bookings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error categorizing bookings"
 *                 error:
 *                   type: string
 *                   example: "Error message from the catch block"
 */
router.get("/host/bookingcategories/:hostId", hostAuth, getBookingCategories);


module.exports = router;