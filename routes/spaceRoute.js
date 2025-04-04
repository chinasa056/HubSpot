const { addSpace } = require("../controllers/spaceController");
const { hostAuth } = require("../middleware/authentication");
const upload = require("../utils/multer")

const router = require("express").Router();

router.post("/space/create/:locationId/:categoryId", hostAuth, upload.array("spaceImages", 5),addSpace)

module.exports = router