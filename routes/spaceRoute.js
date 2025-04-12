const { getSpacesByHost } = require("../controllers/hostController");
const { addSpace, getAllSpaces, getOneSpace, getSpacesByLocation, getSpacesByCategory, deleteSpace, updateSpace, getTopRatedSpaces, approveSpace } = require("../controllers/spaceController");
const { hostAuth, authenticate, isAdmin } = require("../middleware/authentication");
const upload = require("../utils/multer")

const router = require("express").Router();

router.post("/space/create", hostAuth, upload.array("images", 5), addSpace);

router.get("/space/getAll",  getAllSpaces);
router.get("/space/getOne/:spaceId", getOneSpace);

router.post("/space/location", getSpacesByLocation);


router.post("/space/category", getSpacesByCategory);

router.get("/space/toprated", getTopRatedSpaces);


router.get("/space/host", hostAuth, getSpacesByHost);

router.patch("/space/update/:spaceId", authenticate, isAdmin, updateSpace);

router.delete("/space/delete/:spaceId", authenticate, isAdmin, deleteSpace);


router.patch("/space/approve/:spaceId", authenticate, isAdmin, approveSpace);

module.exports = router