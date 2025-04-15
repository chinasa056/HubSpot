const cloudinary = require("../database/cloudinary");
const fs = require("fs");
const Host = require("../models/host");
const Space = require("../models/space");
const User = require("../models/user");

exports.addSpace = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, overview, amenities, pricePerDay, pricePerHour, capacity, availability, averageRating, spaceType, location, spaceAdress,
    } = req.body;

    let parsedAvailability;

    try {
      if (!availability || typeof availability !== "string") {
        throw new Error("Availability must be a valid JSON string");
      }
      parsedAvailability = JSON.parse(availability);
    } catch (err) {
      return res.status(400).json({ message: "Invalid availability format", error: err.message });
    };


    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Please upload images for the space." });
    }

    const host = await Host.findByPk(userId);
    if (!host) {
      return res.status(404).json({ message: "Host Not Found" });
    }

    const currentDate = new Date();
    const spaceCount = await Space.findAll({ where: { hostId: userId } });

    if (host.subscription === null) {
      return res.status(404).json({
        message: "Please subscribe to a plan before listing your space",
      });
    } else if (host.subscription === "Standard" && spaceCount.length === 3) {
      return res.status(400).json({
        message:
          "You are on the Standard plan and cannot list more than 3 spaces. Would you like to upgrade to Premium?",
      });
    }

    if (host.subscriptionExpired < currentDate) {
      return res.status(400).json({
        message:
          "Your subscription has expired, please renew and enjoy the full benefits of our platform",
      });
    }

    const space = await Space.findOne({ where: { name: name.toLowerCase() } });
    if (space) {
      return res
        .status(400)
        .json({ message: "A space cannot be listed twice." });
    }

    const uploadedImages = [];

    for (const image of files) {
      try {
        const result = await cloudinary.uploader.upload(image.path);

        uploadedImages.push({
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
        });

        try {
          if (fs.existsSync(image.path)) {
            fs.unlinkSync(image.path);
            console.log(`Deleted local file: ${image.path}`);
          }
        } catch (deleteErr) {
          console.warn(`Failed to delete ${image.path}:`, deleteErr.message);
        }
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr.message);
        if (fs.existsSync(image.path)) {
          fs.unlinkSync(image.path);
        }
      }
    }

    const newSpace = await Space.create({
      hostId: userId,
      spaceAdress,
      spaceType: spaceType.toLowerCase(),
      name: name.toLowerCase(),
      overview,
      amenities,
      pricePerDay,
      pricePerHour,
      capacity,
      availability: parsedAvailability,
      averageRating,
      location,
      images: uploadedImages,
    });

    res.status(201).json({
      message: "New Space Listed Successfully",
      data: newSpace,
    });
  } catch (error) {
    console.error(error);

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`Deleted file during error cleanup: ${file.path}`);
          }
        } catch (cleanupErr) {
          console.warn(`Error during cleanup for ${file.path}:`, cleanupErr.message);
        }
      });
    }

    res.status(500).json({
      message: "Error Adding a Space: " + error.message,
      data: error.message,
    });
  }
};

exports.getAllSpaces = async (req, res) => {
  try {
    const availableSpaces = await Space.findAll({
      where: { isApproved: true },
    });

    res.status(200).json({
      message: "All Spaces Availabe",
      data: availableSpaces,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting all spaces",
      data: error.message,
    });
  }
};

exports.getOneSpace = async (req, res) => {
  try {
    const { spaceId } = req.params;

    const space = await Space.findByPk(spaceId);
    if (!space) {
      return res.status(404).json({
        message: "Space Not Found",
      });
    };

    res.status(200).json({
      message: "Details For This Space",
      data: space,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting a space",
      data: error.message,
    });
  }
};

exports.getSpacesByLocation = async (req, res) => {
  try {
    const { location } = req.query;

    const spaces = await Space.findAll({ where: { location: location } });

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

exports.getSpacesBySpaceType = async (req, res) => {
  try {
    const { spaceType } = req.query;

    const spaces = await Space.findAll({ where: { spaceType: spaceType.toLowerCase() } });

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
    const { userId: hostId } = req.user;

    const spaces = await Space.findAll({
      where: { hostId },
      include: [
        {
          model: Host,
          attributes: ["fullName"],
        },
      ],
    });

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
    const updatedData = req.body;
    const files = req.files;

    const space = await Space.findByPk(spaceId);

    if (!space) {
      return res.status(404).json({
        message: "Space Not Found",
      });
    }

    if (files && files.length > 0) {
      for (const image of space.images) {
        await cloudinary.uploader.destroy(image.imagePublicId);
      }

      const newUploadedImages = [];
      for (const image of files) {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "spaces",
        });
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
    const { userId } = req.user;
    const { spaceId } = req.params;
    const adminUser = await User.findByPk(userId);
    if (!adminUser) {
      return res.status(404).json({
        message: "Admin Not Found",
      });
    }

    const space = await Space.findByPk(spaceId);
    if (!space) {
      return res.status(404).json({
        message: "Space Not Found",
      });
    };

    if (space.bookingCount > 0) {
      return res.status(400).json({
        message: "This space has an active booking and cannot be deleted"
      })
    };

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

// OUR TOP RATED SPACES
exports.getTopRatedSpaces = async (req, res) => {
  try {
    const spaces = await Space.findAll();
    const topRatedSpaces = spaces.filter((space) => space.averageRating >= 4.5);

    if (topRatedSpaces.length === 0) {
      return res.status(404).json({
        message: "No average rating found",
      });
    }

    res.status(200).json({
      message: "Our top rated spaces",
      data: topRatedSpaces,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error Deleting Space",
      data: error.message,
    });
  }
};

exports.approveSpace = async (req, res) => {
  try {
    const { userId } = req.user;
    const { spaceId } = req.params;

    const adminUser = await User.findByPk(userId);
    if (!adminUser) {
      return res.status(404).json({
        message: "Approval Failed: Admin User not found",
      });
    }

    const space = await Space.findByPk(spaceId);
    if (!space) {
      return res.status(404).json({
        message: "Approval Failed: Space Not found",
      });
    }

    if (space.isAprroved === true) {
      return res.status(400).json({
        message: "Space has already been approved",
      });
    }

    space.isApproved = true;
    space.listingStatus = "active"
    await space.save();

    res.status(200).json({
      message: "Space Approved Successfully",
      data: space,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error approving  Space",
      data: error.message,
    });
  }
};
