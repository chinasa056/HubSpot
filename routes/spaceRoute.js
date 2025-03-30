const { addSpace, getAllSpaces, getOneSpace, getSpacesByLocation, getSpacesByCategory, getSpacesByHost, deleteSpace, updateSpace } = require("../controllers/spaceController");
<<<<<<< HEAD

const router = require("express").Router();

router.post("/spaces/create", addSpace)
=======
const { hostAuth, authenticate } = require("../middleware/authentication");

const router = require("express").Router();

router.post("/spaces/create", hostAuth, addSpace)
>>>>>>> 748974928828890465859f5bd7c6f85525c2ef32

router.get("/spaces/get", getAllSpaces)

router.get("/spaces/getOne", getOneSpace)

router.get('/spaces/location/:locationId', getSpacesByLocation);

router.get('/spaces/category/:categoryId', getSpacesByCategory);

<<<<<<< HEAD
router.get('/spaces/host/:hostId', getSpacesByHost);

router.patch('/spaces/update/:spaceId', updateSpace);

router.delete('/spaces/:spaceId', deleteSpace);
=======
router.get('/spaces/host/:hostId',authenticate, getSpacesByHost);

router.patch('/spaces/update/:spaceId',hostAuth, updateSpace);

router.delete('/spaces/:spaceId',hostAuth, deleteSpace);
>>>>>>> 748974928828890465859f5bd7c6f85525c2ef32

module.exports = router