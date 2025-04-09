const { createCategory, getAllCategory, getOneCategory, updateCategory, deleteCategory, getAvailability } = require("../controllers/categoryController");
const { authenticate, isAdmin, hostAuth } = require("../middleware/authentication");

const router = require("express").Router()


/**
 * @swagger
 * /api/v1/category/one/create:
 *   post:
 *     summary: Create a new category
 *     description: This route allows a host to create a new category. It requires authorization for a host account.
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
 *                 description: The name of the category to create.
 *                 example: "Luxury"
 *     responses:
 *       201:
 *         description: Category successfully created
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
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Luxury"
 *       400:
 *         description: Category already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This Category Already Exists"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user not found"
 *       500:
 *         description: Server error while creating category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error Creating category"
 *                 data:
 *                   type: string
 *                   example: "Error message details"
 */

router.post("/category/one/create",authenticate, isAdmin, createCategory)

/**
 * @swagger
 * /api/v1/category/all:
 *   get:
 *     summary: Get all categories
 *     description: This route retrieves all available categories from the database.
 *     tags: [Users]
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
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Luxury"
 *       500:
 *         description: Server error while retrieving categories
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
 *                   example: "Error message details"
 */
router.get("/category/all", getAllCategory);

/**
 * @swagger
 * /api/v1/category/getOne/{categoryId}:
 *   get:
 *     summary: Get a specific category by ID
 *     description: This route retrieves a specific category along with the associated spaces.
 *     tags: [Users]
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: The ID of the category to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the category
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
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Luxury"
 *                     spaces:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 101
 *                           name:
 *                             type: string
 *                             example: "Beachfront Space"
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
 *         description: Server error while retrieving the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving this category"
 *                 data:
 *                   type: string
 *                   example: "Error message details"
 */
router.get("/category/getOne/:categoryId", getOneCategory);

/**
 * @swagger
 * /api/v1/category/update/{categoryId}:
 *   patch:
 *     summary: Update a category
 *     description: This route allows you to update the name of a specific category.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: The ID of the category to update.
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: name
 *         in: body
*/
router.patch("/category/update/:categoryId",authenticate, isAdmin,updateCategory);

/**
 * @swagger
 * /api/v1/category/delete/{categoryId}:
 *   delete:
 *     summary: Delete a category
 *     description: This route allows you to delete a specific category.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: The ID of the category to delete.
 *         schema:
 *           type: integer
 *           example: 1
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
 *         description: Server error while deleting the category
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
 *                   example: "Error message details"
 */
router.delete("/category/delete/:categoryId", authenticate,isAdmin, deleteCategory);
// router.post("/availability", getAvailability)

module.exports = router