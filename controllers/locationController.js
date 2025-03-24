const locationModel = require("../models/location");
const Space = require("../models/space");

exports.addLocation = async (req, res) => {
    try {
        const { name } = req.body

        const location = await locationModel.findOne({ where: { name } })
        if (location) {
            return res.status(200).json({
                message: "You have added this location already"
            })
        }
        const newLocation = await locationModel.create({
            name
        })
        res.status(201).json({
            message: "New Location Created",
            data: newLocation
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error Adding Location ",
            data: error.message
        })
    }
};

exports.getAllLocation = async (req, res) => {
    try {
        const locations = await locationModel.findAll();

        res.status(200).json({
            message: "All Location Available",
            data: locations
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error getting all Location ",
            data: error.message
        })
    }
};

exports.getOneLocation = async (req, res) => {
    try {
        const { locationId } = req.params;

        const location = await locationModel.findByPk(locationId, {
            include: [{
                model: Space
            }]
        })
        if (!location) {
            return res.status(404).json({
                message: "Locatio Not Found"
            })
        };

        res.status(200).json({
            message: "Locatio Found",
            data: location
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error getting Location ",
            data: error.message
        })
    }
};

exports.deleteLocation = async (req, res) => {
    try {
        const { locationId } = req.params

        const location = await locationModel.findByPk(locationId);
        if (!location) {
            return res.status(404).json({
                message: "Location Not Found"
            })
        }

        location.destroy();

        res.status(200).json({
            message: "Location Deleted Successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error getting Location ",
            data: error.message
        })
    }
}

