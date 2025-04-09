const { addLocation, getAllLocation, getOneLocation, deleteLocation } = require("../controllers/locationController");
const { authenticate, isAdmin, hostAuth } = require("../middleware/authentication");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Endpoints related to managing locations
 */

/**
 * @swagger
 * /api/v1/location/create:
 *   post:
 *     summary: Add a new location
 *     description: Allows an authenticated admin to create a new location. Prevents duplication by checking if the location already exists.
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the location
 *                 example: Conference Room A
 *     responses:
 *       201:
 *         description: New Location Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New Location Created
 *                 data:
 *                   type: object
 *                   description: Created location details
 *       200:
 *         description: Location already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You have added this location already
 *       500:
 *         description: Server error while adding location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error Adding Location
 *                 data:
 *                   type: string
 *                   example: Sequelize validation or DB error message
 */

router.post("/location/create",hostAuth,addLocation);

/**
 * @swagger
 * /api/v1/location/get:
 *   get:
 *     summary: Get all locations
 *     description: Retrieves a list of all available locations.
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: All Location Available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All Location Available
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Location data
 *       500:
 *         description: Server error while fetching locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting all Location
 *                 data:
 *                   type: string
 *                   example: Sequelize error or database failure
 */

router.get("/location/get", getAllLocation);

/**
 * @swagger
 * /api/v1/location/getOne/{locationId}:
 *   get:
 *     summary: Get a single location by ID
 *     description: Retrieves a specific location by its ID, including all associated spaces.
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the location to retrieve
 *     responses:
 *       200:
 *         description: Location Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Locatio Found
 *                 data:
 *                   type: object
 *                   description: Location data with associated spaces
 *       404:
 *         description: Location not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Locatio Not Found
 *       500:
 *         description: Server error while fetching the location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting Location
 *                 data:
 *                   type: string
 *                   example: Sequelize or database error
 */


router.get("/location/getOne/:locationId", getOneLocation);

/**
 * @swagger
 * /api/v1/location/delete/{locationId}:
 *   delete:
 *     summary: Delete a location by ID
 *     description: Deletes a specific location by its ID. Only works if the location exists.
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the location to delete
 *     responses:
 *       200:
 *         description: Location Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Location Deleted Successfully
 *       404:
 *         description: Location not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Location Not Found
 *       500:
 *         description: Server error while deleting location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting Location
 *                 data:
 *                   type: string
 *                   example: Sequelize or database error
 */


router.delete("/location/delete/:locationId",hostAuth, deleteLocation)

module.exports = router