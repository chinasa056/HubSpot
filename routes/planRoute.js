const { createSubcriptionPlan, getAllPlan, getPlan } = require("../controllers/subscriptionController")
const { authenticate, isAdmin, hostAuth } = require("../middleware/authentication")

const router = require("express").Router()
/**
 * @swagger
 * /api/v1/plan/create:
 *   post:
 *     summary: Create a new subscription plan
 *     description: This route allows an admin to create a new subscription plan.
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
 *               planName:
 *                 type: string
 *                 example: "Premium Plan"
 *                 description: The name of the subscription plan.
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 29.99
 *                 description: The amount for the subscription plan.
 *               description:
 *                 type: string
 *                 example: "Access to premium features"
 *                 description: A description of the subscription plan.
 *     responses:
 *       201:
 *         description: Plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plan created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     planName:
 *                       type: string
 *                       example: "Premium Plan"
 *                     amount:
 *                       type: number
 *                       format: float
 *                       example: 29.99
 *                     description:
 *                       type: string
 *                       example: "Access to premium features"
 *       400:
 *         description: Plan already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plan already exist"
 *       500:
 *         description: Server error while creating the subscription plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating subscription"
 *                 data:
 *                   type: string
 *                   example: "Error message details"
 */
router.post("/plan/create", authenticate, isAdmin, createSubcriptionPlan);

/**
 * @swagger
 * /api/v1/plan/get:
 *   get:
 *     summary: Get all subscription plans
 *     description: This route retrieves all the available subscription plans.
 *     tags: [Host]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all subscription plans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All subscription plans"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       planName:
 *                         type: string
 *                         example: "Premium Plan"
 *                       amount:
 *                         type: number
 *                         format: float
 *                         example: 29.99
 *                       description:
 *                         type: string
 *                         example: "Access to premium features"
 *       404:
 *         description: No subscription plans found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "*
*/
router.get("/plan/get",hostAuth, getAllPlan)
/**
 * @swagger
 * /api/v1/plan/get-one/{planId}:
 *   get:
 *     summary: Get a single subscription plan
 *     description: This route retrieves the details of a specific subscription plan by its ID.
 *     tags: [Host]
 *     parameters:
 *       - name: planId
 *         in: path
 *         required: true
 *         description: The ID of the subscription plan to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Details of the requested subscription plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All details for this plan"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     planName:
 *                       type: string
 *                       example: "Premium Plan"
 *                     amount:
 *                       type: number
 *                       format: float
 *                       example: 29.99
 *                     description:
 *                       type: string
 *                       example: "Access to premium features"
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plan not found"
 *       500:
 *         description: Server error while retrieving the subscription plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving plan"
 */
router.get("/plan/get-one/:planId", getPlan);


module.exports = router