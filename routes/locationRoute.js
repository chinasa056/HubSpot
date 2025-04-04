const { addLocation, getAllLocation, getOneLocation, deleteLocation } = require("../controllers/locationController");
const { authenticate, isAdmin } = require("../middleware/authentication");

const router = require("express").Router();


router.post("/location/create",authenticate, isAdmin, addLocation);

router.get("/location/get", getAllLocation);

router.get("/location/getOne/:locationId", getOneLocation);

router.delete("/location/delete/:locationId", deleteLocation)

module.exports = router