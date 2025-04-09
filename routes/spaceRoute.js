const { getSpacesByHost } = require("../controllers/hostController");
const { addSpace, getAllSpaces, getOneSpace, getSpacesByLocation, getSpacesByCategory, deleteSpace, updateSpace, getTopRatedSpaces, approveSpace } = require("../controllers/spaceController");
const { hostAuth } = require("../middleware/authentication");
const upload = require("../utils/multer")

const router = require("express").Router();

router.post("/space/create/:locationId/:categoryId", hostAuth, upload.array("spaceImages", 5),addSpace);

router.get("/space/getAll",  getAllSpaces);

router.get("/space/getOne/:spaceId", getOneSpace);

router.get("/space/location/:locationId", getSpacesByLocation);

router.get("/space/category/:categoryId", getSpacesByCategory)

router.get("/space/toprated", getTopRatedSpaces);

router.get("/space/host",hostAuth,getSpacesByHost);

router.patch("/space/update/:spaceId", hostAuth, updateSpace)

router.delete("/space/delete/:spaceId", hostAuth, deleteSpace);


router.patch("/space/approve/:spaceId", hostAuth, approveSpace)
module.exports = router