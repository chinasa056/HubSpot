const Category = require("../models/category");
const Location = require("../models/location");
const spaceModel = require("../models/space")
const cloudinary = require('cloudinary').v2;
const fs = require("fs")

exports.addSpace = async (req, res) => {
    try {
        const {hostId} = req.user
        const {locationId, categoryId } = req.params;
        const { name, overView, amenities, pricePerHour, pricePerDay,availability } = req.body;
        const files = req.files

        // Check if files are uploaded
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "Please upload images for the space." });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category Does Not Exist" });
        }

        const location = await Location.findByPk(locationId);
        if (!location) {
            return res.status(404).json({ message: "Location Not Found" });
        }

        const host = await hostModel.findByPk(hostId);
        if (!host) {
            return res.status(404).json({ message: "Host Not Found" });
        }

        const space = await spaceModel.findOne({ where: { name } });
        if (space) {
            return res.status(400).json({ message: "A space cannot be listed twice." });
        }

        // Upload images to Cloudinary
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
            name,
            description,
            amenities,
            overView,
            pricePerDay,
            pricePerHour,
            availability,
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

        // Fetch all spaces for the given location
        const spaces = await spaceModel.findAll({
            where: { locationId },
            include: [
                {
                    model: Location,
                    attributes: ['id', 'name'],
                },
            ],
        });

        // Check if spaces exist
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

        // Fetch all spaces for the given category
        const spaces = await spaceModel.findAll({
            where: { categoryId },
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'], 
                },
            ],
        });

        // Check if spaces exist for the category
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

        // Find the space by its ID
        const space = await spaceModel.findByPk(spaceId);

        // Check if the space exists
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

        // If new images are uploaded, delete previous ones and upload the new images
        if (files && files.length > 0) {
            // Delete existing images from Cloudinary
            for (const image of space.images) {
                await cloudinary.uploader.destroy(image.imagePublicId); 
            }

            // Upload new images to Cloudinary
            const newUploadedImages = [];
            for (const image of files) {
                const result = await cloudinary.uploader.upload(image.path, { folder: "spaces" });
                fs.unlinkSync(image.path); // Remove temporary file from server
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
      const { spaceId } = req.params; // Get space ID from request parameters
  
      // Find the space by its ID
      const space = await spaceModel.findByPk(spaceId);
  
      // Check if the space exists
      if (!space) {
        return res.status(404).json({
          message: "Space Not Found",
        });
      }
  
      // Delete associated images from Cloudinary
      if (space.images && space.images.length > 0) {
        for (const image of space.images) {
          await cloudinary.uploader.destroy(image.imagePublicId); 
        }
      }
  
      // Delete the space from the database
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
  