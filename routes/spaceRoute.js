const { getSpacesByHost } = require("../controllers/hostController");
const { addSpace, getAllSpaces, getOneSpace, getSpacesByLocation, getSpacesByCategory, deleteSpace, updateSpace, getTopRatedSpaces, approveSpace } = require("../controllers/spaceController");
const { hostAuth, authenticate, isAdmin } = require("../middleware/authentication");
const upload = require("../utils/multer")

const router = require("express").Router();
/**
 * @swagger
 * /api/v1/space/create/{locationId}/{categoryId}:
 *   post:
 *     summary: Add a new space listing
 *     description: |
 *       This endpoint allows a host to add a new space listing to the platform. 
 *       The host must be authenticated and subscribed to a valid plan to list spaces. 
 *       The number of spaces a host can list depends on the active subscription plan. 
 *       Hosts on the "Standard" plan can only list a maximum of 2 spaces. 
 *       If the host's subscription has expired, they must renew it before listing a space.
 *     tags: [Host]
 *     parameters:
 *       - name: locationId
 *         in: path
 *         description: The ID of the location where the space is listed.
 *         required: true
 *         schema:
 *           type: string
 *       - name: categoryId
 *         in: path
 *         description: The ID of the category under which the space is listed.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the space being listed.
 *                 example: "Cozy Office Space"
 *               description:
 *                 type: string
 *                 description: A detailed description of the space.
 *                 example: "A modern office space with comfortable seating and high-speed internet."
 *               amenities:
 *                 type: string
 *                 description: A list of amenities available in the space.
 *                 example: "Wi-Fi, Projector, Whiteboard"
 *               pricePerDay:
 *                 type: number
 *                 description: Price per day for booking the space.
 *                 example: 100
 *               pricePerHour:
 *                 type: number
 *                 description: Price per hour for booking the space.
 *                 example: 25
 *               capacity:
 *                 type: number
 *                 description: Maximum number of people the space can accommodate.
 *                 example: 10
 *               availability:
 *                 type: string
 *                 description: The availability schedule for the space.
 *                 example: "[\"Mon-Fri 9am-5pm\", \"Sat-Sun 10am-4pm\"]"
 *               spaceImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 description: A list of image URLs for the space.
 *                 example: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"]
 *     responses:
 *       201:
 *         description: Space listing created successfully.
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
 *                   description: The newly created space listing data.
 *       400:
 *         description: Bad request. The space could not be added due to missing or invalid data, expired subscription, or exceeded space limit based on the current subscription plan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your subscription has expired, please renew and enjoy the full benefits of our platform."
 *       401:
 *         description: Unauthorized. Host must be logged in and subscribed to a valid plan before listing a space.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You need to subscribe to a plan to list a space."
 *       404:
 *         description: Not Found. The location, category, or host does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category Does Not Exist"
 *       500:
 *         description: Internal server error. Something went wrong while adding the space.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Adding a Space"
 */
router.post("/space/create/:locationId/:categoryId", hostAuth, upload.array("spaceImages", 5), addSpace);

/**
 * @swagger
 * /api/v1/space/getAll:
 *   get:
 *     summary: Get all approved spaces
 *     description: This endpoint retrieves all spaces that have been approved and are available for booking. The response includes the details of each space such as name, description, amenities, price, and more.
 *     tags: [Host, Users]
 *     responses:
 *       200:
 *         description: A list of all available spaces that have been approved.
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
 *                         type: string
 *                         description: The unique identifier for the space.
 *                         example: "bcbf8b74-fffa-4784-a55f-55d2c820800b"
 *                       name:
 *                         type: string
 *                         description: The name of the space.
 *                         example: "Cozy Office Space"
 *                       description:
 *                         type: string
 *                         description: A detailed description of the space.
 *                         example: "A modern office space with comfortable seating and high-speed internet."
 *                       amenities:
 *                         type: string
 *                         description: The amenities available in the space.
 *                         example: "Wi-Fi, Projector, Whiteboard"
 *                       pricePerDay:
 *                         type: number
 *                         description: Price per day for booking the space.
 *                         example: 100
 *                       pricePerHour:
 *                         type: number
 *                         description: Price per hour for booking the space.
 *                         example: 25
 *                       capacity:
 *                         type: number
 *                         description: Maximum number of people the space can accommodate.
 *                         example: 10
 *                       availability:
 *                         type: string
 *                         description: Availability schedule of the space.
 *                         example: "[\"Mon-Fri 9am-5pm\", \"Sat-Sun 10am-4pm\"]"
 *                       spaceImages:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: uri
 *                         description: A list of image URLs for the space.
 *                         example: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"]
 *       500:
 *         description: Internal server error while retrieving spaces.
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
 *                   example: "Error message details"
 */
router.get("/space/getAll",  getAllSpaces);

/**
 * @swagger
 * /api/v1/space/getOne/{spaceId}:
 *   get:
 *     summary: Get details of a specific space
 *     description: This endpoint retrieves detailed information about a specific space by its unique ID. It returns space details such as name, description, amenities, pricing, and availability.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         description: The unique identifier of the space.
 *         schema:
 *           type: string
 *           example: "bcbf8b74-fffa-4784-a55f-55d2c820800b"
 *     responses:
 *       200:
 *         description: Details of the specified space.
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
 *                       description: The unique identifier for the space.
 *                       example: "bcbf8b74-fffa-4784-a55f-55d2c820800b"
 *                     name:
 *                       type: string
 *                       description: The name of the space.
 *                       example: "Cozy Office Space"
 *                     description:
 *                       type: string
 *                       description: A detailed description of the space.
 *                       example: "A modern office space with comfortable seating and high-speed internet."
 *                     amenities:
 *                       type: string
 *                       description: The amenities available in the space.
 *                       example: "Wi-Fi, Projector, Whiteboard"
 *                     pricePerDay:
 *                       type: number
 *                       description: Price per day for booking the space.
 *                       example: 100
 *                     pricePerHour:
 *                       type: number
 *                       description: Price per hour for booking the space.
 *                       example: 25
 *                     capacity:
 *                       type: number
 *                       description: Maximum number of people the space can accommodate.
 *                       example: 10
 *                     availability:
 *                       type: string
 *                       description: Availability schedule of the space.
 *                       example: "[\"Mon-Fri 9am-5pm\", \"Sat-Sun 10am-4pm\"]"
 *                     spaceImages:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: uri
 *                       description: A list of image URLs for the space.
 *                       example: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"]
 *       404:
 *         description: Space not found with the provided ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space Not Found"
 *       500:
 *         description: Internal server error while retrieving the space.
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
 *                   example: "Error message details"
 */
router.get("/space/getOne/:spaceId", getOneSpace);


/**
 * @swagger
 * /api/v1/space/location/{locationId}:
 *   get:
 *     summary: Get spaces available at a specific location
 *     description: This endpoint retrieves all spaces listed in a specific location. It returns a list of spaces, including their details such as name, description, amenities, and pricing.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         description: The unique identifier for the location where spaces are listed.
 *         schema:
 *           type: string
 *           example: "3a2a0f93-0c97-47e5-908e-2143edec5d22"
 *     responses:
 *       200:
 *         description: A list of spaces available at the given location.
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
 *                         type: string
 *                         description: The unique identifier of the space.
 *                         example: "f34b5d79-97e4-4b65-b697-58e6c69e7f7c"
 *                       name:
 *                         type: string
 *                         description: The name of the space.
 *                         example: "Modern Conference Room"
 *                       description:
 *                         type: string
 *                         description: A description of the space.
 *                         example: "A spacious room with seating for 15, perfect for meetings."
 *                       pricePerDay:
 *                         type: number
 *                         description: The price per day to book the space.
 *                         example: 200
 *                       pricePerHour:
 *                         type: number
 *                         description: The price per hour to book the space.
 *                         example: 50
 *                       amenities:
 *                         type: string
 *                         description: List of amenities available in the space.
 *                         example: "Wi-Fi, Projector, Whiteboard"
 *                       capacity:
 *                         type: number
 *                         description: Maximum number of people the space can accommodate.
 *                         example: 20
 *                       availability:
 *                         type: string
 *                         description: Availability schedule of the space.
 *                         example: "[\"Mon-Fri 9am-5pm\"]"
 *                       location:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: The name of the location.
 *                             example: "Downtown Conference Center"
 *       404:
 *         description: No spaces found at the given location.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Spaces Found for This Location"
 *       500:
 *         description: Internal server error while retrieving spaces.
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
 *                   example: "Error message details"
 */
router.get("/space/location/:locationId", getSpacesByLocation);


/**
 * @swagger
 * /api/v1/space/category/{categoryId}:
 *   get:
 *     summary: Get spaces available in a specific category
 *     description: This endpoint retrieves all spaces listed under a specific category. It returns a list of spaces, including their details such as name, description, amenities, and pricing.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: The unique identifier for the category where spaces are listed.
 *         schema:
 *           type: string
 *           example: "5b1c2f47-d29c-4b62-bb12-43d10f2a6e43"
 *     responses:
 *       200:
 *         description: A list of spaces available in the given category.
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the space.
 *                         example: "d6e21c6c-5573-47a1-bc6a-8fbb98d7c9c7"
 *                       name:
 *                         type: string
 *                         description: The name of the space.
 *                         example: "Elegant Conference Room"
 *                       description:
 *                         type: string
 *                         description: A description of the space.
 *                         example: "A spacious and modern room suitable for meetings and conferences."
 *                       pricePerDay:
 *                         type: number
 *                         description: The price per day to book the space.
 *                         example: 250
 *                       pricePerHour:
 *                         type: number
 *                         description: The price per hour to book the space.
 *                         example: 60
 *                       amenities:
 *                         type: string
 *                         description: List of amenities available in the space.
 *                         example: "Wi-Fi, Projector, Whiteboard"
 *                       capacity:
 *                         type: number
 *                         description: Maximum number of people the space can accommodate.
 *                         example: 20
 *                       availability:
 *                         type: string
 *                         description: Availability schedule of the space.
 *                         example: "[\"Mon-Fri 9am-5pm\"]"
 *                       category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: The name of the category.
 *                             example: "Conference Rooms"
 *       404:
 *         description: No spaces found in the given category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Spaces Found for This Category"
 *       500:
 *         description: Internal server error while retrieving spaces.
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
 *                   example: "Error message details"
 */
router.get("/space/category/:categoryId", getSpacesByCategory);

/**
 * @swagger
 * /api/v1/space/toprated:
 *   get:
 *     summary: Get top-rated spaces
 *     description: This endpoint retrieves all spaces with an average rating of 4.5 and above. It returns a list of top-rated spaces, including their details such as name, description, amenities, and pricing.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of top-rated spaces with an average rating of 4.5 and above.
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the space.
 *                         example: "d6e21c6c-5573-47a1-bc6a-8fbb98d7c9c7"
 *                       name:
 *                         type: string
 *                         description: The name of the space.
 *                         example: "Elegant Conference Room"
 *                       description:
 *                         type: string
 *                         description: A description of the space.
 *                         example: "A spacious and modern room suitable for meetings and conferences."
 *                       pricePerDay:
 *                         type: number
 *                         description: The price per day to book the space.
 *                         example: 250
 *                       pricePerHour:
 *                         type: number
 *                         description: The price per hour to book the space.
 *                         example: 60
 *                       amenities:
 *                         type: string
 *                         description: List of amenities available in the space.
 *                         example: "Wi-Fi, Projector, Whiteboard"
 *                       capacity:
 *                         type: number
 *                         description: Maximum number of people the space can accommodate.
 *                         example: 20
 *                       availability:
 *                         type: string
 *                         description: Availability schedule of the space.
 *                         example: "[\"Mon-Fri 9am-5pm\"]"
 *                       averageRating:
 *                         type: number
 *                         description: The average rating of the space.
 *                         example: 4.7
 *       404:
 *         description: No top-rated spaces found (average rating >= 4.5).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No average rating found"
 *       500:
 *         description: Internal server error while retrieving top-rated spaces.
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
 *                   example: "Error message details"
 */
router.get("/space/toprated", getTopRatedSpaces);


/**
 * @swagger
 * /api/v1/space/host:
 *   get:
 *     summary: Get spaces by host
 *     description: This endpoint retrieves all the spaces listed by a specific host. It returns the spaces' details, including their name, description, pricing, and other related information for the authenticated host.
 *     tags: [Host]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of spaces listed by the authenticated host.
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
 *                         type: string
 *                         description: The unique identifier of the space.
 *                         example: "d6e21c6c-5573-47a1-bc6a-8fbb98d7c9c7"
 *                       name:
 *                         type: string
 *                         description: The name of the space.
 *                         example: "Luxury Office Space"
 *                       description:
 *                         type: string
 *                         description: A description of the space.
 *                         example: "A premium office space available for rent."
 *                       pricePerDay:
 *                         type: number
 *                         description: The price per day to book the space.
 *                         example: 100
 *                       pricePerHour:
 *                         type: number
 *                         description: The price per hour to book the space.
 *                         example: 25
 *                       amenities:
 *                         type: string
 *                         description: List of amenities available in the space.
 *                         example: "Wi-Fi, Coffee machine, Whiteboard"
 *                       capacity:
 *                         type: number
 *                         description: The capacity of the space (how many people it can accommodate).
 *                         example: 15
 *                       availability:
 *                         type: string
 *                         description: The availability schedule of the space.
 *                         example: "[\"Mon-Fri 9am-6pm\"]"
 *                       averageRating:
 *                         type: number
 *                         description: The average rating of the space.
 *                         example: 4.6
 *                       host:
 *                         type: object
 *                         properties:
 *                           fullName:
 *                             type: string
 *                             description: Full name of the host.
 *                             example: "John Doe"
 *       404:
 *         description: No spaces found for the authenticated host.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Spaces Found for This Host"
 *       500:
 *         description: Internal server error while fetching spaces.
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
 *                   example: "Error message details"
 */
router.get("/space/host", hostAuth, getSpacesByHost);

/**
 * @swagger
 * /api/v1/space/update/{spaceId}:
 *   patch:
 *     summary: Update a space
 *     description: This endpoint allows the host to update the details of a listed space, including name, description, pricing, amenities, and images. It requires authentication for the host.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         description: The unique ID of the space to be updated.
 *         schema:
 *           type: string
 *           example: "d6e21c6c-5573-47a1-bc6a-8fbb98d7c9c7"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the space.
 *                 example: "Luxury Office Space"
 *               description:
 *                 type: string
 *                 description: A detailed description of the space.
 *                 example: "A premium office space available for rent."
 *               amenities:
 *                 type: string
 *                 description: The updated amenities available in the space.
 *                 example: "Wi-Fi, Coffee machine, Whiteboard"
 *               pricePerDay:
 *                 type: number
 *                 description: The updated price per day to rent the space.
 *                 example: 100
 *               pricePerHour:
 *                 type: number
 *                 description: The updated price per hour to rent the space.
 *                 example: 25
 *               capacity:
 *                 type: number
 *                 description: The updated capacity of the space.
 *                 example: 20
 *               availability:
 *                 type: string
 *                 description: The updated availability schedule of the space.
 *                 example: "[\"Mon-Fri 9am-6pm\"]"
 *     responses:
 *       200:
 *         description: Successfully updated the space.
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
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the space.
 *                       example: "d6e21c6c-5573-47a1-bc6a-8fbb98d7c9c7"
 *                     name:
 *                       type: string
 *                       description: The updated name of the space.
 *                       example: "Luxury Office Space"
 *                     description:
 *                       type: string
 *                       description: The updated description of the space.
 *                       example: "A premium office space available for rent."
 *                     pricePerDay:
 *                       type: number
 *                       description: The updated price per day for the space.
 *                       example: 100
 *                     pricePerHour:
 *                       type: number
 *                       description: The updated price per hour for the space.
 *                       example: 25
 *                     amenities:
 *                       type: string
 *                       description: The updated list of amenities in the space.
 *                       example: "Wi-Fi, Coffee machine, Whiteboard"
 *                     capacity:
 *                       type: number
 *                       description: The updated capacity of the space.
 *                       example: 20
 *                     availability:
 *                       type: string
 *                       description: The updated availability of the space.
 *                       example: "[\"Mon-Fri 9am-6pm\"]"
 *                     spaceImages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           imageUrl:
 *                             type: string
 *                             description: The URL of the space image.
 *                             example: "https://cloudinary.com/image_url"
 *                           imagePublicId:
 *                             type: string
 *                             description: The public ID of the image.
 *                             example: "image_public_id"
 *       400:
 *         description: No images uploaded, or invalid space ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please upload images for the space."
 *       404:
 *         description: Space not found for the provided spaceId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space Not Found"
 *       500:
 *         description: Internal server error while updating the space.
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
 *                   example: "Error message details"
 */
router.patch("/space/update/:spaceId", authenticate, isAdmin, updateSpace);


/**
 * @swagger
 * /api/v1/space/delete/{spaceId}:
 *   delete:
 *     summary: Delete a space
 *     description: This endpoint allows an authenticated host or admin to delete a space, including its images, from the platform.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         description: The unique ID of the space to be deleted.
 *         schema:
 *           type: string
 *           example: "d6e21c6c-5573-47a1-bc6a-8fbb98d7c9c7"
 *     responses:
 *       200:
 *         description: Successfully deleted the space.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space Deleted Successfully"
 *       404:
 *         description: Space not found for the provided spaceId or admin not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space Not Found"
 *       500:
 *         description: Internal server error while deleting the space.
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
 *                   example: "Error message details"
 */
router.delete("/space/delete/:spaceId", authenticate, isAdmin, deleteSpace);

/**
 * @swagger
 * /api/v1/space/approve/{spaceId}:
 *   patch:
 *     summary: Approve a space
 *     description: This endpoint allows an admin to approve a space that has been listed by a host. The space must be unapproved initially.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         description: The unique ID of the space to be approved.
 *         schema:
 *           type: string
 *           example: "d6e21c6c-5573-47a1-bc6a-8fbb98d7c9c7"
 *     responses:
 *       200:
 *         description: Successfully approved the space.
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
 *         description: The space has already been approved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space has already been approved"
 *       404:
 *         description: Admin user or space not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Approval Failed: Space Not found"
 *       500:
 *         description: Internal server error while approving the space.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error approving space"
 *                 data:
 *                   type: string
 *                   example: "Error message details"
 */
router.patch("/space/approve/:spaceId", authenticate, isAdmin, approveSpace);

module.exports = router