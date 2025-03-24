const { addLocation, getAllLocation, getOneLocation, deleteLocation } = require("../controllers/locationController");

const router = require("express").Router();

router.post("/location/create", addLocation);

router.get("/location/get", getAllLocation);

router.get("/location/getOne", getOneLocation);

router.delete("/location/delete", deleteLocation)

module.exports = router