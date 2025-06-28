const { favoriteAndUnfavoriteSpace, getUserFavoriteSpace } = require("../controllers/favorite");
const { authenticate } = require("../middleware/authentication");

const router = require("express").Router();

/**
 * @swagger
 * /api/v1/favourite/add:
 *   post:
 *     summary: Favorite or Unfavorite a Space
 *     description: |
 *       Allows an authenticated user to favorite or unfavorite a space.  
 *       - If the space is not already in the user's favorites, it will be added.  
 *       - If the space is already in the user's favorites, it will be removed.
 *     tags: [Favorite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *           example: "2e5d7b3a-f843-4b6b-9ab3-c3cb12cbce5e"
 *         description: ID of the space to favorite or unfavorite
 *     responses:
 *       200:
 *         description: Space successfully favorited or unfavorited
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Save space as favorite successful
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: string
 *                   example: Error details
 */
router.post("/favourite/add", authenticate, favoriteAndUnfavoriteSpace);

/**
 * @swagger
 * /api/v1/favourite/get:
 *   get:
 *     summary: Get User's Favorite Spaces
 *     description: Retrieves a list of all spaces marked as favorite by the currently authenticated user.
 *     tags: [Favorite]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved favorite spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Retrieve user favorite spaces successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "e923bb48-d127-491b-8a80-878e6c1c9c20"
 *                       userId:
 *                         type: string
 *                         example: "8accc83e-7cc0-4bb7-851b-4a90183a3053"
 *                       spaceId:
 *                         type: string
 *                         example: "9f2ddba6-cb2d-4f0f-b92c-055f1dc9ac56"
 *                       Space:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Modern Studio Apartment"
 *                           averageRating:
 *                             type: number
 *                             example: 4.5
 *       404:
 *         description: No favorite space found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No favorite space found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: string
 *                   example: Error details
 */
router.get("favourite/get", authenticate, getUserFavoriteSpace)

module.exports = router