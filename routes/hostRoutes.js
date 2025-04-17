const { registerHost, verifyHost, loginHost, forgottenPasswordHost, resetPasswordHost, changePasswordHost, loggedOutHost, updateHostDetails, deleteHostAccount, getSpacesByHost, getBookingCategories, manageListing, getSpaceBookings, getHostCurrentBalance } = require('../controllers/hostController');

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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "host@example.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+1234567890"
 *                     companyName:
 *                       type: string
 *                       example: "Tech Innovations Ltd."
 *                     companyAddress:
 *                       type: string
 *                       example: "123 Tech Street, Silicon Valley"
 *                     isVerified:
 *                       type: boolean
 *                       example: false
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
router.post('/host/register', /*upload.single("ninImage"), registerHostValidator,*/ registerHost);


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
 *     description: Authenticates a host using their email and password. Returns a token and the host's name upon successful login.
 *     tags: [Host]
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
 *                 example: "host@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "hostPassword123"
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
 *                   type: string
 *                   description: Host's full name
 *                   example: "Jane Doe"
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated host.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing input fields, incorrect credentials, or account not verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Incorrect credentials"
 *       404:
 *         description: Host not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "login failed: incorrect credentials"
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
 *   patch:
 *     summary: Reset host password
 *     description: Resets the password of a host using a valid JWT token provided in the URL. The host must provide matching `newPassword` and `confirmPassword` fields in the request body.
 *     tags: [Host]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: JWT token received from password reset email.
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "newSecurePass123"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "newSecurePass123"
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully. You can now log in with your new password."
 *       400:
 *         description: Bad request due to missing data, mismatched passwords, or expired/invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Passwords do not match"
 *       404:
 *         description: Host account not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Internal server error while resetting password.
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

router.patch("/host/reset-password",resetPasswordValidator, resetPasswordHost)

/**
 * @swagger
 * /api/v1/host/change-password/{userId}:
 *   patch:
 *     summary: Change host's password
 *     description: This endpoint allows an authenticated host to change their password by providing the current password, new password, and confirmation of the new password.
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the host whose password is being changed.
 *         schema:
 *           type: integer
 *           example: 1
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
 *                 description: The current password of the host.
 *                 example: "currentPassword123"
 *               newPassword:
 *                 type: string
 *                 description: The new password the host wants to set.
 *                 example: "newSecurePassword456"
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the new password.
 *                 example: "newSecurePassword456"
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
 *         description: Invalid input or password mismatch.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "New passwords do not match"
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
 *         description: Internal server error during password change.
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
 * /api/v1/host/getspaces:
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
router.get("/host/getspaces", hostAuth, getSpacesByHost);

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
 * /api/v1/host/spacebookings:
 *   get:
 *     summary: Get space and associated bookings for a host
 *     description: Retrieves the space owned by the authenticated host along with booking details such as user name, start date, end date, booking status, and user profile image.
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Space and bookings retrieved successfully
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
 *                       example: "Premium Coworking Space"
 *                     Bookings:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userName:
 *                             type: string
 *                             example: "John Doe"
 *                           startDate:
 *                             type: string
 *                             format: date
 *                             example: "2025-04-15"
 *                           endDate:
 *                             type: string
 *                             format: date
 *                             example: "2025-04-20"
 *                           status:
 *                             type: string
 *                             example: "active"
 *                           profileImage:
 *                             type: string
 *                             format: uri
 *                             example: "https://res.cloudinary.com/.../profile.jpg"
 *       404:
 *         description: Host or space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No space found for this host"
 *       500:
 *         description: Server error while fetching bookings
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
 *                   example: "Internal server error"
 */
router.get("/host/spacebookings", hostAuth, getSpaceBookings);
/**
 * @swagger
 * /api/v1/host/bookingcategories:
 *   get:
 *     summary: Categorize host bookings by status
 *     description: Returns the count of a host's bookings grouped into upcoming, active, and completed categories based on the current date.
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings categorized successfully
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
 *                           type: number
 *                           example: 3
 *                         active:
 *                           type: number
 *                           example: 2
 *                         completed:
 *                           type: number
 *                           example: 5
 *       500:
 *         description: Server error while categorizing bookings
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
 *                   example: "Internal server error"
 */
router.get("/host/bookingcategories", hostAuth, getBookingCategories);

/**
 * @swagger
 * /api/v1/host/currentbalance:
 *   get:
 *     summary: Retrieve current balance for the authenticated host
 *     description: Returns the current balance amount for the logged-in host, representing their earnings from confirmed bookings.
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Host current balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host Current Balance"
 *                 data:
 *                   type: number
 *                   example: 150000
 *       404:
 *         description: Host not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Host Not Found"
 *       500:
 *         description: Server error while fetching current balance
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
 *                   example: "Internal server error"
 */
router.get("/host/currentbalance", hostAuth, getHostCurrentBalance)


module.exports = router;