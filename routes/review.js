const { addReview, getReviewsForASpace, updateReview, deleteReview } = require("../controllers/reviewController");
const { authenticate } = require("../middleware/authentication");

const router = require("express").Router();

/**
 * @swagger
 * /api/v1/review/create:
 *   post:
 *     summary: Add a review for a space
 *     description: Authenticated users can add a review and rating for a space. Each user can only leave one review per space.
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *           example: "f3a2b5c6-d7e8-4f90-abc1-1234567890ef"
 *         description: ID of the space being reviewed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewText:
 *                 type: string
 *                 example: "This space was perfect for our team meeting!"
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4.5
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review Added Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     spaceId:
 *                       type: string
 *                     reviewText:
 *                       type: string
 *                     rating:
 *                       type: number
 *       404:
 *         description: User not found, space not found, or review already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review failed: Space not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error adding review"
 *                 data:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/review/create", authenticate, addReview);

/**
 * @swagger
 * /api/v1/review/get:
 *   get:
 *     summary: Get all reviews for a specific space
 *     description: Fetch all user reviews associated with a particular space.
 *     tags: [Review]
 *     parameters:
 *       - in: query
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *           example: "f3a2b5c6-d7e8-4f90-abc1-1234567890ef"
 *         description: ID of the space to retrieve reviews for
 *     responses:
 *       200:
 *         description: All reviews for the specified space
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All reviews for this space"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       spaceId:
 *                         type: string
 *                       reviewText:
 *                         type: string
 *                       rating:
 *                         type: number
 *                       userName:
 *                         type: string
 *       404:
 *         description: Space not found or no reviews available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review failed: No review for this space"
 *       500:
 *         description: Server error while fetching reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching review"
 *                 data:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/review/get", getReviewsForASpace);

/**
 * @swagger
 * /api/v1/review/update:
 *   patch:
 *     summary: Update a review
 *     description: Authenticated users can update their existing reviews for a space.
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *           example: "1a2b3c4d-5678-90ef-ghij-klmnopqrstuv"
 *         description: ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewText:
 *                 type: string
 *                 example: "Updated review text goes here."
 *               rating:
 *                 type: number
 *                 example: 4
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviewText:
 *                       type: string
 *                     rating:
 *                       type: number
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review not found: Unable to update"
 *       500:
 *         description: Server error while updating review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating review"
 *                 data:
 *                   type: string
 *                   example: "Internal server error"
 */
router.patch("/review/update", authenticate, updateReview);


/**
 * @swagger
 * /api/v1/review/delete:
 *   delete:
 *     summary: Delete a review
 *     description: Authenticated users can delete their reviews using the review ID.
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: ID of the review to be deleted
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review deleted successfully"
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review not found: Unable to delete"
 *       500:
 *         description: Server error while deleting review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting review"
 *                 data:
 *                   type: string
 *                   example: "Internal server error"
 */
router.delete("/review/delete", authenticate, deleteReview)



module.exports = router