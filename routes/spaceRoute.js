const { addSpace, getAllSpaces, getOneSpace, getSpacesByLocation, getSpacesByCategory, getSpacesByHost, deleteSpace, updateSpace } = require("../controllers/spaceController");

const router = require("express").Router();

router.post("/spaces/create", addSpace)

router.get("/spaces/get", getAllSpaces)

router.get("/spaces/getOne", getOneSpace)

router.get('/spaces/location/:locationId', getSpacesByLocation);

router.get('/spaces/category/:categoryId', getSpacesByCategory);

router.get('/spaces/host/:hostId', getSpacesByHost);

router.patch('/spaces/update/:spaceId', updateSpace);

router.delete('/spaces/:spaceId', deleteSpace);

module.exports = router