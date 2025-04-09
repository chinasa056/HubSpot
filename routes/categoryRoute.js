const { createCategory, getAllCategory, getOneCategory, updateCategory, deleteCategory, getAvailability } = require("../controllers/categoryController");
const { authenticate, isAdmin, hostAuth } = require("../middleware/authentication");

const router = require("express").Router()

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Endpoints related to category management
 */

/**
 * @swagger
 * /api/v1/category/one/create:
 *   post:
 *     summary: Create a new category (authenticated and authorized)
 *     description: |
 *       - This route requires **authentication** via a valid JWT token.
 *       - The JWT token must be included in the `Authorization` header as follows:
 *         ```
 *         Authorization: Bearer [YourJWTToken]
 *         ```
 *       - Replace `[YourJWTToken]` with the token received upon login or account verification.
 *       - Only users with **admin privileges** can access this route.
 *     tags: [Category]
 *     security:
 *       - bearerAuth: [] # Requires a valid JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category to be created
 *                 example: Technology
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "New Category Created"
 *                 data:
 *                   type: object
 *                   description: Details of the newly created category
 *       400:
 *         description: Validation error or category already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This Category Already Exists"
 *       404:
 *         description: Admin user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error during category creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Creating category"
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post("/category/one/create",hostAuth, createCategory)

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Endpoints related to category management
 */

/**
 * @swagger
 * /api/v1/category/all:
 *   get:
 *     summary: Retrieve all categories
 *     description: |
 *       This endpoint retrieves all available categories from the database.
 *       It does not require authentication or authorization and can be accessed publicly.
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Successfully retrieved all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All Category available"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Details of the categories
 *       500:
 *         description: Server error during category retrieval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving categories"
 *                 data:
 *                   type: string
 *                   description: Error message
 */

router.get("/category/all", getAllCategory);


/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Endpoints related to category management
 */

/**
 * @swagger
 * /api/v1/category/getOne/{categoryId}:
 *   get:
 *     summary: Retrieve details of a specific category
 *     description: |
 *       This endpoint retrieves the details of a specific category by its ID.
 *       The response includes related entities, such as spaces associated with the category.
 *       It can be accessed publicly and does not require authentication.
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the category details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category Retrieved Successfully"
 *                 data:
 *                   type: object
 *                   description: Details of the specific category, including associated spaces
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category Not Found"
 *       500:
 *         description: Internal server error during category retrieval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving this categories"
 *                 data:
 *                   type: string
 *                   description: Error details
 */

router.get("/category/getOne/:categoryId", getOneCategory);

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Endpoints related to category management
 */

/**
 * @swagger
 * /api/v1/category/update/{categoryId}:
 *   patch:
 *     summary: Update an existing category (authenticated and authorized)
 *     description: |
 *       This endpoint allows **admin users** to update the details of an existing category.
 *       - **Authentication**: Requires a valid JWT token in the `Authorization` header.
 *       - **Authorization**: Only users with admin privileges can access this route.
 *       - Provide the `categoryId` in the path parameter and the updated name in the request body.
 *       - Example Authorization Header:
 *         ```
 *         Authorization: Bearer [YourJWTToken]
 *         ```
 *     tags: [Category]
 *     security:
 *       - bearerAuth: [] # Indicates authentication using JWT
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name for the category
 *                 example: Updated Technology
 *     responses:
 *       200:
 *         description: Successfully updated the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category Updated Successfully"
 *                 data:
 *                   type: object
 *                   description: Details of the updated category
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category Not Found"
 *       500:
 *         description: Internal server error during category update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating the category"
 *                 data:
 *                   type: string
 *                   description: Error details
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.patch("/category/update/:categoryId",hostAuth,updateCategory);

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Endpoints related to category management
 */

/**
 * @swagger
 * /api/v1/category/delete/{categoryId}:
 *   delete:
 *     summary: Delete a specific category (authenticated and authorized)
 *     description: |
 *       This endpoint allows **admin users** to delete a specific category by its ID.
 *       - **Authentication**: Requires a valid JWT token in the `Authorization` header.
 *       - **Authorization**: Only users with admin privileges can access this route.
 *       - Provide the `categoryId` in the path parameter to specify the category to delete.
 *       - Example Authorization Header:
 *         ```
 *         Authorization: Bearer [YourJWTToken]
 *         ```
 *     tags: [Category]
 *     security:
 *       - bearerAuth: [] # Indicates authentication using JWT
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category Deleted Successfully"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category Not Found"
 *       500:
 *         description: Internal server error during category deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting category"
 *                 data:
 *                   type: string
 *                   description: Error details
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.delete("/category/delete/:categoryId",hostAuth,deleteCategory)

// router.post("/availability", getAvailability)

module.exports = router