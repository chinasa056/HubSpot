const { getSpacesByHost } = require("../controllers/hostController");
const { addSpace, getAllSpaces, getOneSpace, getSpacesByLocation, deleteSpace, updateSpace, getTopRatedSpaces, approveSpace, getSpacesBySpaceType, getUnapprovedSpaces } = require("../controllers/spaceController");
const { hostAuth, authenticate, isAdmin } = require("../middleware/authentication");
const { addSpaceValidator } = require("../middleware/validator");
const upload = require("../utils/multer")

const router = require("express").Router();
/**
 * @swagger
 * /api/v1/space/create:
 *   post:
 *     summary: Create a new space
 *     description: |
 *       This endpoint allows hosts to create a new space listing on the platform. The user must be authenticated as a host to access this route. 
 *       Only authorized hosts with an active subscription (Standard or Premium) can create spaces.
 *       
 *       The request requires the submission of space details such as the space name, overview, amenities, pricing, capacity, availability, space type, 
 *       location, and space address, along with images for the listing. The availability is provided as a stringified JSON object which will be parsed before saving.
 *       
 *       Hosts on the Standard subscription are limited to 3 spaces, and they must upgrade to the Premium plan to list more than 3 spaces. The uploaded images 
 *       will be stored on Cloudinary, and space data will be saved to the database after validation.
 *     tags: [Space]
 *     security:
 *       - bearerAuth: []  # Adding the bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - overview
 *               - amenities
 *               - pricePerDay
 *               - pricePerHour
 *               - capacity
 *               - availability
 *               - spaceType
 *               - location
 *               - spaceAdress
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Lush Boardroom"
 *               overview:
 *                 type: string
 *                 example: "A premium boardroom for your executive meetings."
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["WiFi", "Projector", "AC", "Coffee"]
 *               pricePerDay:
 *                 type: number
 *                 example: 25000
 *               pricePerHour:
 *                 type: number
 *                 example: 4000
 *               capacity:
 *                 type: number
 *                 example: 10
 *               availability:
 *                 type: string
 *                 format: JSON
 *                 example: '{"monday": {"start": "08:00", "end": "18:00"}, "friday": {"start": "09:00", "end": "17:00"}}'
 *               averageRating:
 *                 type: number
 *                 example: 4.5
 *               spaceType:
 *                 type: string
 *                 example: "boardroom"
 *               location:
 *                 type: string
 *                 example: "Victoria Island, Lagos"
 *               spaceAdress:
 *                 type: string
 *                 example: "Plot 7, Akin Adesola Street"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: New space created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "New Space Listed Successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request (validation or business logic error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please upload images for the space."
 *       500:
 *         description: Server error while creating space
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Adding a Space"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post("/space/create", hostAuth, upload.array("images", 5), addSpaceValidator,addSpace);

/**
 * @swagger
 * /api/v1/space/getAll:
 *   get:
 *     summary: Retrieve all available spaces
 *     description: Fetches all spaces that are approved and available. No authentication required for accessing the list of available spaces.
 *     tags: [Space]
 *     responses:
 *       200:
 *         description: A list of all available spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All Spaces Available"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Lush Boardroom"
 *                       overview:
 *                         type: string
 *                         example: "A premium boardroom for your executive meetings."
 *                       amenities:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["WiFi", "Projector", "AC", "Coffee"]
 *                       pricePerDay:
 *                         type: number
 *                         example: 25000
 *                       pricePerHour:
 *                         type: number
 *                         example: 4000
 *                       capacity:
 *                         type: number
 *                         example: 10
 *                       availability:
 *                         type: string
 *                         example: '{"monday": {"start": "08:00", "end": "18:00"}}'
 *                       spaceType:
 *                         type: string
 *                         example: "boardroom"
 *                       location:
 *                         type: string
 *                         example: "Victoria Island, Lagos"
 *                       spaceAdress:
 *                         type: string
 *                         example: "Plot 7, Akin Adesola Street"
 *                       averageRating:
 *                         type: number
 *                         example: 4.5
 *                       isApproved:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Server error while retrieving spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error getting all spaces"
 *                 data:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/space/getAll",  getAllSpaces);
/**
 * @swagger
 * /api/v1/space/getOne/{spaceId}:
 *   get:
 *     summary: Retrieve details of a single space
 *     description: Fetches the details of a specific space based on the provided space ID.
 *     tags: [Space]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         description: The UUID of the space to retrieve.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "e9b1f35a-2d4f-4b71-912a-42b6b90d98a0"
 *     responses:
 *       200:
 *         description: Space details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Details For This Space"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "e9b1f35a-2d4f-4b71-912a-42b6b90d98a0"
 *                     name:
 *                       type: string
 *                       example: "Lush Boardroom"
 *                     overview:
 *                       type: string
 *                       example: "A premium boardroom for your executive meetings."
 *                     amenities:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["WiFi", "Projector", "AC", "Coffee"]
 *                     pricePerDay:
 *                       type: number
 *                       example: 25000
 *                     pricePerHour:
 *                       type: number
 *                       example: 4000
 *                     capacity:
 *                       type: number
 *                       example: 10
 *                     availability:
 *                       type: string
 *                       example: '{"monday": {"start": "08:00", "end": "18:00"}}'
 *                     spaceType:
 *                       type: string
 *                       example: "boardroom"
 *                     location:
 *                       type: string
 *                       example: "Victoria Island, Lagos"
 *                     spaceAdress:
 *                       type: string
 *                       example: "Plot 7, Akin Adesola Street"
 *                     averageRating:
 *                       type: number
 *                       example: 4.5
 *                     isApproved:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space Not Found"
 *       500:
 *         description: Server error while retrieving space
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error getting a space"
 *                 data:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/space/getOne/:spaceId", getOneSpace);

/**
 * @swagger
 * /api/v1/space/location:
 *   get:
 *     summary: Retrieve spaces by location
 *     description: |
 *       This endpoint allows users to retrieve all **approved spaces** listed on the platform for a given location.
 *       <br/><br/>
 *       The location must be provided as a **query parameter** in the request URL, e.g.:
 *       ```
 *       GET /api/v1/space/location?location=Victoria Island
 *       ```
 *       <br/>
 *       It is case-sensitive and should match how the location was originally saved (e.g., "Victoria Island", "Lekki Phase 1", etc.).
 *       <br/><br/>
 *       This is useful for users who want to browse available spaces in specific cities, districts, or neighborhoods.
 *     tags: [Space]
 *     parameters:
 *       - in: query
 *         name: location
 *         required: true
 *         description: The location to filter spaces by. Must match saved location format.
 *         schema:
 *           type: string
 *           example: "Victoria Island"
 *     responses:
 *       200:
 *         description: Spaces found in the specified location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Spaces Found for This Location"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 12
 *                       name:
 *                         type: string
 *                         example: "Lush Co-Working Space"
 *                       location:
 *                         type: string
 *                         example: "Victoria Island"
 *                       spaceType:
 *                         type: string
 *                         example: "office"
 *                       capacity:
 *                         type: number
 *                         example: 20
 *                       pricePerDay:
 *                         type: number
 *                         example: 15000
 *                       images:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             imageUrl:
 *                               type: string
 *                               example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *                             imagePublicId:
 *                               type: string
 *                               example: "demo/sample"
 *       404:
 *         description: No spaces found for the specified location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Spaces Found for This Location"
 *       500:
 *         description: Internal server error while retrieving spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Getting Spaces by Location"
 *                 data:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/space/location", getSpacesByLocation);

/**
 * @swagger
 * /api/v1/space/host:
 *   get:
 *     summary: Get all spaces created by the authenticated host
 *     description: >
 *       This endpoint allows a logged-in host to retrieve all spaces they have listed on the platform.  
 *       It returns each space along with basic host information (e.g., full name).  
 *       This route is protected and can only be accessed by authenticated users with a host role.  
 *       
 *       The host ID is extracted from the verified authentication token provided in the `Authorization` header.
 *     tags: [Space]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Spaces successfully retrieved for the host
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
 *                     $ref: '#/components/schemas/Space'
 *       404:
 *         description: No spaces found for this host
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Spaces Found for This Host"
 *       500:
 *         description: Server error while fetching host's spaces
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
 *                   example: "Detailed error message"
 */
router.get("/space/host", hostAuth, getSpacesByHost);

/**
 * @swagger
 * /api/v1/space/type:
 *   get:
 *     summary: Get spaces by space type
 *     description: >
 *       Retrieve all approved spaces that belong to a specific category/type.  
 *       The `spaceType` is passed as a query parameter in the URL.  
 *       This allows users to filter spaces by categories like "boardroom", "coworking", "event hall", etc.
 *       
 *       Example usage:  
 *       `/api/v1/space/type?spaceType=boardroom`
 *     tags: [Space]
 *     parameters:
 *       - in: query
 *         name: spaceType
 *         schema:
 *           type: string
 *         required: true
 *         description: The type/category of the space (e.g., boardroom, coworking, private office)
 *     responses:
 *       200:
 *         description: Spaces found for the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Spaces Found for This Category"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Space'
 *       404:
 *         description: No spaces found for the given category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Spaces Found for This Category"
 *       500:
 *         description: Error fetching spaces by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Fetching Spaces by Category"
 *                 data:
 *                   type: string
 *                   example: "Detailed error message"
 */

router.get("/space/type", getSpacesBySpaceType);

/**
 * @swagger
 * /api/v1/space/toprated:
 *   get:
 *     summary: Retrieve top-rated spaces
 *     description: >
 *       This public endpoint returns a list of top-rated spaces on the platform.  
 *       A space is considered top-rated if its average rating is **4.5 or higher**.  
 *       This route is accessible to all users (no authentication required) and is useful for displaying premium quality listings to users.
 *     tags: [Space]
 *     responses:
 *       200:
 *         description: Top-rated spaces successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Our top rated spaces"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Space'
 *       404:
 *         description: No top-rated spaces found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No average rating found"
 *       500:
 *         description: Server error while fetching top-rated spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Deleting Space"
 *                 data:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.get("/space/toprated", getTopRatedSpaces);

/**
 * @swagger
 * /api/v1/space/update/{spaceId}:
 *   patch:
 *     summary: Update a space
 *     description: >
 *       This endpoint allows an **admin** to update details of an existing space.  
 *       The admin must be authenticated.  
 *       All existing images will be removed and replaced if new images are uploaded.  
 *       Updates can include fields like name, overview, amenities, pricing, location, and availability.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the space to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Boardroom Name"
 *               overview:
 *                 type: string
 *                 example: "Updated description of the boardroom."
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Whiteboard", "Air Conditioning", "High-speed WiFi"]
 *               pricePerDay:
 *                 type: number
 *                 example: 30000
 *               pricePerHour:
 *                 type: number
 *                 example: 5000
 *               capacity:
 *                 type: number
 *                 example: 12
 *               availability:
 *                 type: string
 *                 format: JSON
 *                 example: '{"monday": {"start": "08:00", "end": "18:00"}, "friday": {"start": "09:00", "end": "17:00"}}'
 *               spaceType:
 *                 type: string
 *                 example: "conference"
 *               location:
 *                 type: string
 *                 example: "Lekki Phase 1, Lagos"
 *               spaceAdress:
 *                 type: string
 *                 example: "12B Admiralty Way"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Optional new images to replace existing ones
 *     responses:
 *       200:
 *         description: Space updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space Updated Successfully"
 *                 data:
 *                   type: object
 *       404:
 *         description: Space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space Not Found"
 *       500:
 *         description: Server error while updating space
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Updating Space"
 *                 data:
 *                   type: string
 *                   example: "Detailed error message"
 */

router.patch("/space/update/:spaceId", authenticate, isAdmin, updateSpace);

/**
 * @swagger
 * /api/v1/space/delete/{spaceId}:
 *   delete:
 *     summary: Delete a space
 *     description: >
 *       This endpoint allows an **admin** to delete a space from the platform.  
 *       The admin must be authenticated.  
 *       A space cannot be deleted if it has active bookings.  
 *       If the space has associated images stored in Cloudinary, they will be removed prior to deletion.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the space to be deleted
 *     responses:
 *       200:
 *         description: Space deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space Deleted Successfully"
 *       400:
 *         description: Space cannot be deleted due to active bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This space has an active booking and cannot be deleted"
 *       404:
 *         description: Admin or space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space Not Found"
 *       500:
 *         description: Server error during deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Deleting Space"
 *                 data:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.delete("/space/delete/:spaceId", authenticate, isAdmin, deleteSpace);

/**
 * @swagger
 * /api/v1/space/approve/{spaceId}:
 *   patch:
 *     summary: Approve a space listing
 *     description: >
 *       This endpoint allows an **admin** to approve a space listing submitted by a host.  
 *       Approval marks the space as visible and bookable on the platform.  
 *       Only authenticated admin users can access this route.  
 *       A space that has already been approved cannot be approved again.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the space to approve
 *     responses:
 *       200:
 *         description: Space approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space Approved Successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Space'
 *       400:
 *         description: Space has already been approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space has already been approved"
 *       404:
 *         description: Admin or Space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Approval Failed: Space Not found"
 *       500:
 *         description: Server error during approval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error approving Space"
 *                 data:
 *                   type: string
 *                   example: "Detailed error message"
 */

router.patch("/space/approve/:spaceId", authenticate, isAdmin, approveSpace);

/**
 * @swagger
 * /api/v1/spaces/unapproved:
 *   get:
 *     summary: Get all unapproved spaces (Admin only)
 *     description: Admin route to retrieve all spaces in the database that have not yet been approved.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all unapproved spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All unapproved spaces in the database"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1b2c3d4e-567f-890g-h1i2-j3k4l5m6n7o8"
 *                       name:
 *                         type: string
 *                         example: "The Green Room"
 *                       isApproved:
 *                         type: boolean
 *                         example: false
 *                       location:
 *                         type: string
 *                         example: "Lekki Phase 1, Lagos"
 *                       hostId:
 *                         type: string
 *                         example: "3e4f5g6h-789i-012j-k3l4-m5n6o7p8q9r0"
 *                       pricePerDay:
 *                         type: number
 *                         example: 30000
 *                       capacity:
 *                         type: number
 *                         example: 15
 *       404:
 *         description: No unapproved space found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Unapproved Space found"
 *       500:
 *         description: Server error while retrieving unapproved spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error approving Space"
 *                 data:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/spaces/unapproved", authenticate, isAdmin, getUnapprovedSpaces)

module.exports = router