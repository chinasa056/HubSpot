const { createCategory, getAllCategory, getOneCategory, updateCategory, deleteCategory } = require("../controllers/categoryController")

const router = require("express").Router()

router.post("/category/create", createCategory)

router.get("/category/all", getAllCategory);

router.get("/category/getOne/:categoryId", getOneCategory);

router.patch("/category/update/:categoryId", updateCategory);

router.delete("/category/delete/:categoryId", deleteCategory)

module.exports = router