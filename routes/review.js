const { addReview, getReviewsForASpace, updateReview, deleteReview } = require("../controllers/reviewController")

const router = require("express").Router()

router.post("/review/create/:spaceId", addReview)

router.post("/review/get/:spaceId", getReviewsForASpace)

router.post("/review/update/:reviewId", updateReview)

router.post("/review/delete/:reviewId", deleteReview)

module.exports = router