const Review = require("../models/review_rating");
const Space = require("../models/space");
const User = require("../models/user");

exports.addReview = async (req, res) => {
  try {
    const { userId } = req.user;
    const { spaceId } = req.params;
    const { reviewText, rating } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: "Review failed: User not found",
      });
    }

    const space = await Space.findByPk(spaceId);
    if (!space) {
      return res.status(404).json({
        message: "Review failed: Space not found",
      });
    }

    const reviewExist = await Review.findOne({ where: { userId, spaceId } });
    if (reviewExist) {
      return res.status(404).json({
        message:
          "You already have a review for this space, will you like to update it?",
      });
    }

    const review = await Review.create({
      userId,
      userName: user.fullName,
      spaceId,
      spaceName: space.name,
      reviewText,
      rating,
    });

    const allReviews = await Review.findAll({ where: { spaceId } });
    const totalReviews = allReviews.reduce((acc, cur) => acc + cur.rating, 0);

    space.averageRatings = totalReviews / allReviews.length;

    res.status(201).json({
      message: "Review Added Successfully",
      data: review,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error adding review ",
      data: error.message,
    });
  }
};

exports.getReviewsForASpace = async (req, res) => {
  try {
    const { spaceId } = req.params;

    const space = await Space.findByPk(spaceId);
    if (!space) {
      return res.status(404).json({
        message: "fetching review failed:  space not found",
      });
    }

    const reviews = await Review.findAll({ where: { spaceId } });
    if (reviews.length === 0) {
      return res.status(404).json({
        message: "Review failed: No review for this space",
      });
    }

    res.status(200).json({
      message: "All reviews for this space",
      data: reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching review ",
      data: error.message,
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reviewText, rating } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found: Unable to update",
      });
    }

    const data = {
      reviewText: reviewText || review.reviewText,
      rating: rating || review.rating,
    };

    await Review.update(data, { where: { reviewId } });

    await review.update({
      reviewText: reviewText || review.reviewText,
      rating: rating || review.rating,
    });

    res.status(200).json({
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating review",
      data: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        message: "Review not found: Unable to delete",
      });
    }

    // Delete the review
    await review.destroy();

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting review",
      data: error.message,
    });
  }
};
