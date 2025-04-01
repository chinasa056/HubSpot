const { createCategory, getAllCategory, getOneCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { authenticate, isAdmin } = require("../middleware/authentication");

const router = require("express").Router()

router.post("/category/one/create",authenticate,isAdmin, createCategory)

router.get("/category/all", getAllCategory);

router.get("/category/getOne/:categoryId", getOneCategory);

router.patch("/category/update/:categoryId",authenticate,isAdmin, updateCategory);

router.delete("/category/delete/:categoryId",authenticate,isAdmin, deleteCategory)

module.exports = router