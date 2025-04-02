const { addSpace, getAllSpaces, getOneSpace, getSpacesByLocation, getSpacesByCategory, getSpacesByHost, deleteSpace, updateSpace } = require("../controllers/spaceController");
const { hostAuth, authenticate } = require("../middleware/authentication");

const router = require("express").Router();

router.post("/spaces/create", hostAuth, addSpace)

router.get("/spaces/get", getAllSpaces)

router.get("/spaces/getOne", getOneSpace)

router.get('/spaces/location/:locationId', getSpacesByLocation);

router.get('/spaces/category/:categoryId', getSpacesByCategory);

router.get('/spaces/host/:hostId',authenticate, getSpacesByHost);

router.patch('/spaces/update/:spaceId',hostAuth, updateSpace);

router.delete('/spaces/:spaceId',hostAuth, deleteSpace);

module.exports = router