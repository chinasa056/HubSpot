const { createSubcriptionPlan, getAllPlan, getPlan } = require("../controllers/subscriptionController")
const { authenticate, isAdmin } = require("../middleware/authentication")

const router = require("express").Router()

router.post("/plan/create", authenticate, isAdmin, createSubcriptionPlan)

router.get("/plan/get", getAllPlan)

router.get("/plan/get-one/:planId", getPlan)

module.exports = router