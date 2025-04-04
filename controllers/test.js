const Test = require("../models/test.js");


exports.createTest = async (req, res) => {
    try {
        const { availability, amenities } = req.body

        const newTest = await Test.create({
            availability,
            amenities
        })

        res.status(201).json({
            message: "New Category Created",
            data: newTest
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error Creating test",
            data: error.message
        })
    }
};