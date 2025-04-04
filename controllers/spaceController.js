const Category = require("../models/category");
const Location = require("../models/location");
const spaceModel = require("../models/space")
const cloudinary = require("../database/cloudinary");
const fs = require("fs");
const Host = require("../models/host");
const { UUIDV4 } = require("sequelize");

exports.addSpace = async (req, res) => {
    try {
        const { userId:hostId } = req.user
        const { locationId, categoryId } = req.params;
        const { name, description, amenities, pricePerDay, pricePerHour, capacity,  availability, averageRating } = req.body;
        const files = req.files

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "Please upload images for the space." });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category Does Not Exist" });
        }

        const location = await Location.findByPk(locationId);
        if (!location) {
            return res.status(404).json({
                message: "Location Not Found"
            });
        }

        const host = await Host.findByPk(hostId);
        if (!host) {
            return res.status(404).json({ message: "Host Not Found" });
        }

        const space = await spaceModel.findOne({ where: { name } });
        if (space) {
            return res.status(400).json({ message: "A space cannot be listed twice." });
        }

        const uploadedImages = [];
        for (const image of files) {
            const result = await cloudinary.uploader.upload(image.path);
            fs.unlinkSync(image.path);
            const photo = {
                imageUrl: result.secure_url,
                imagePublicId: result.public_id
            }
            uploadedImages.push(photo);

        }

        const newSpace = await spaceModel.create({
            // id:UUIDV4,
            hostId,
            locationId,
            categoryId,
            name,
            description,
            amenities,
            pricePerDay,
            pricePerHour,
            capacity,
            availability,
            averageRating,
            spaceImages: uploadedImages
        });

        res.status(201).json({
            message: "New Space Listed Successfully",
            data: newSpace,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error Adding a Space",
            data: error.message,
        });
    }
};



exports.getAllSpaces = async (req, res) => {
    try {

        const availableSpaces = await spaceModel.findAll();

        res.status(200).json({
            message: "All Spaces Availabe",
            data: availableSpaces
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error getting all spaces",
            data: error.message
        })
    }
};

exports.getOneSpace = async (req, res) => {
    try {
        const { spaceId } = req.params;

        const space = await spaceModel.findByPk(spaceId)
        if (space.length === 0) {
            return res.status(404).json({
                message: "Space Not Found",
            })
        };

        res.status(200).json({
            message: "Details For This Space",
            data: space
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error getting a space",
            data: error.message
        })
    }
};

exports.getSpacesByLocation = async (req, res) => {
    try {
        const { locationId } = req.params;

        const spaces = await spaceModel.findAll({
            where: { locationId },
            include: [
                {
                    model: Location,
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!spaces.length) {
            return res.status(404).json({
                message: "No Spaces Found for This Location",
            });
        }

        res.status(200).json({
            message: "Spaces Found for This Location",
            data: spaces,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error Getting Spaces by Location",
            data: error.message,
        });
    }
};

exports.getSpacesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const spaces = await spaceModel.findAll({
            where: { categoryId },
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!spaces.length) {
            return res.status(404).json({
                message: "No Spaces Found for This Category",
            });
        }

        res.status(200).json({
            message: "Spaces Found for This Category",
            data: spaces,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error Fetching Spaces by Category",
            data: error.message,
        });
    }
};

exports.getSpacesByHost = async (req, res) => {
    try {
        const { hostId } = req.params;

        // Fetch all spaces for the given host
        const spaces = await spaceModel.findAll({
            where: { hostId },
            include: [
                {
                    model: hostModel,
                    attributes: ['id', 'name', 'businessName'], // Optionally include host details
                },
            ],
        });

        // Check if the host has listed any spaces
        if (!spaces.length) {
            return res.status(404).json({
                message: "No Spaces Found for This Host",
            });
        }

        res.status(200).json({
            message: "Spaces Found for This Host",
            data: spaces,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error Fetching Spaces by Host",
            data: error.message,
        });
    }
};

exports.updateSpace = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { name, description, amenities, price, availability } = req.body;
        const files = req.files;

        const space = await spaceModel.findByPk(spaceId);

        if (!space) {
            return res.status(404).json({
                message: "Space Not Found",
            });
        }

        // Update space details
        const updatedData = {
            name: name || space.name,
            description: description || space.description,
            amenities: amenities || space.amenities,
            price: price || space.price,
            availability: availability || space.availability,
        };

        if (files && files.length > 0) {
            for (const image of space.images) {
                await cloudinary.uploader.destroy(image.imagePublicId);
            }

            const newUploadedImages = [];
            for (const image of files) {
                const result = await cloudinary.uploader.upload(image.path, { folder: "spaces" });
                fs.unlinkSync(image.path); 
                newUploadedImages.push({
                    imageUrl: result.secure_url,
                    imagePublicId: result.public_id,
                });
            }

            updatedData.spaceImages = newUploadedImages;
        }

        await space.update(updatedData);

        res.status(200).json({
            message: "Space Updated Successfully",
            data: space,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error Updating Space",
            data: error.message,
        });
    }
};

exports.deleteSpace = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const space = await spaceModel.findByPk(spaceId);

        if (!space) {
            return res.status(404).json({
                message: "Space Not Found",
            });
        }

        if (space.images && space.images.length > 0) {
            for (const image of space.images) {
                await cloudinary.uploader.destroy(image.imagePublicId);
            }
        }

        await space.destroy();

        res.status(200).json({
            message: "Space Deleted Successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error Deleting Space",
            data: error.message,
        });
    }
};
