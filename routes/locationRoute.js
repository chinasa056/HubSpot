const { addLocation, getAllLocation, getOneLocation, deleteLocation } = require("../controllers/locationController");
const { authenticate, isAdmin } = require("../middleware/authentication");

const router = require("express").Router();

/**
 * @swagger
 * /api/v1/location/create:
 *   post:
 *     summary: Add a new location
 *     description: Allows an admin to add a new location. Checks if the location already exists before adding.
 *     tags: [Admin]
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
 *                 description: The name of the location to be added.
 *                 example: "New York"
 *     responses:
 *       201:
 *         description: New location created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "New Location Created"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "New York"
 *       200:
 *         description: Location already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You have added this location already"
 *       500:
 *         description: Internal server error while adding location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Adding Location"
 *                 data:
 *                   type: string
 *                   example: "Error message details"
 */
router.post("/location/create", authenticate, isAdmin, addLocation);

/**
 * @swagger
 * /api/v1/location/get:
 *   get:
 *     summary: Get all locations
 *     description: Retrieves all available locations. This route is accessible to users, admins, and hosts.
 *     tags: [Users, Host]
 *     responses:
 *       200:
 *         description: Successfully retrieved all locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All Location Available"
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
 *                         example: "New York"
 *       500:
 *         description: Internal server error while retrieving locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error getting all Location"
 *                 data:
 *                   type: string
 *                   example: "Error message details"
 */

router.get("/location/get", getAllLocation);

router.get("/location/getOne/:locationId", getOneLocation);
/**
 * @swagger
 * /api/v1/location/delete/{locationId}:
 *   delete:
 *     summary: Delete a location
 *     description: Deletes a location from the system. This route is authorized for admin and host users only.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: locationId
 *         in: path
 *         required: true
 *         description: The ID of the location to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Location Deleted Successfully"
 *       404:
 *         description: Location not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Location Not Found"
 *       500:
 *         description: Server error while deleting location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting Location"
 *                 data:
 *                   type: string
 *                   example: "Error message details"
 */
router.delete("/location/delete/:locationId",authenticate, isAdmin, deleteLocation)

module.exports = router