const categoryModel = require("../models/category");
const Space = require("../models/space");
const User = require("../models/user");

exports.createCategory = async (req, res) => {
    try {
        const {userId} = req.user
        const { name } = req.body

        const user = await User.findByPk(userId)
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }


        const category = await categoryModel.findOne({ where: { name } })
        if (category) {
            return res.status(400).json({
                message: "This Category Already Exists"
            })
        }

        const newCategory = await categoryModel.create({
            name
        })

        res.status(201).json({
            message: "New Category Created",
            data: newCategory
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error Creating category",
            data: error.message
        })
    }
};

exports.getAllCategory = async (req, res) => {
    try {
        const categories = await categoryModel.findAll()

        res.status(200).json({
            message: "All Category available",
            data: categories
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error retrieving categories",
            data: error.message
        })
    }
};
// const organizersRecord = await organizer.findByPk(req.params.id, {
//     include: [{
//         model: event, as: "events",  // Correct alias
//         attributes: ["eventName", "category", "venue", "scheduleDate"]
//     }]
// })

exports.getOneCategory = async (req, res) => {
    try {
        const { categoryId } = req.params

        const category = await categoryModel.findByPk(categoryId, {
            include: [{
                model: Space
            }]
        })
        if (!category) {
            return res.status(404).json({
                message: "Cateory Not Found"
            })
        };
        res.status(200).json({
            message: "Category Retrieved Successfully",
            data: category
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error retrieving this categories",
            data: error.message
        })
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body

        const category = await categoryModel.findByPk(categoryId)
        if (!category) {
            return res.status(404).json({
                message: "Category Not Found"
            })
        };

        const updatedCategory = await category.update({ name });

        res.status(200).json({
            message: "Category Updated Successfully",
            data: updatedCategory
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error updating the category",
            data: error.message
        })
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await categoryModel.findByPk(categoryId)
        if (!category) {
            return res.status(404).json({
                message: "Category Not Found"
            })
        };

        category.destroy()
        res.status(200).json({
            message: "Category Deleted Succesfully"
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error deleting category",
            data: error.message
        })
    }
};
