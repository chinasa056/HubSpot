const User = require("../models/user");
const Favorite = require("../models/favorite");
const Space = require("../models/space");


const favoriteAndUnfavoriteSpace = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const user = await User.findOne({ where: { id: req.user.userId } });
        const existingFavoriteSpace = await Favorite.findOne({ where: { userId: user.id, spaceId } });
        if (!existingFavoriteSpace) {
            await Favorite.create({ where: { userId: user.id, spaceId } });
            return res.status(200).json({
                message: 'Save space as favorite successful'
            })
        }
        await Favorite.destroy({ where: { userId: user.id, spaceId } });
        return res.status(200).json({
            message: 'Remove space as favorite successful'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            data: error.message
        })
    }
}

const getUserFavoriteSpace = async (req, res) => {
    try {
        const favorite = await Favorite.findAll({ where: { userId: req.user.userId },
        include: {
            model: Space,
            attributes: ['name', 'averageRating']
        } });
        if (!favorite.length) {
            return res.status(404).json({
                message: 'No favorite space found'
            })
        }
        return res.status(200).json({
            message: 'Retrieve user favorite spaces successful',
            data: favorite
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            data: error.message
        })
    }
}

module.exports = {
    favoriteAndUnfavoriteSpace,
    getUserFavoriteSpace
};
