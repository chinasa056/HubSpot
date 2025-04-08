const { favoriteAndUnfavoriteSpace, getUserFavoriteSpace } = require("../controllers/favorite");
const { authenticate } = require("../middleware/authentication");

const favoriteRouter = require("express").Router();

favoriteRouter.post("/space", authenticate, favoriteAndUnfavoriteSpace);
favoriteRouter.post("/space", authenticate, getUserFavoriteSpace);

module.exports = favoriteRouter;
