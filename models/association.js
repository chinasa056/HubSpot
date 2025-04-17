const Space = require('./space');
const Host = require('./host');
const Review = require('./review_rating');
const Booking = require('./booking');
const User = require('./user');

// Set associations

Host.hasMany(Space, { foreignKey: 'hostId' });
Space.belongsTo(Host, { foreignKey: 'hostId' });

Review.belongsTo(Space, { foreignKey: 'spaceId' });
Space.hasMany(Review, { foreignKey: 'spaceId' });
Review.belongsTo(User, {foreignKey: 'userId'})
User.hasMany(Review,{foreignKey: 'userId'})


Booking.belongsTo(User, { foreignKey: 'userId' });
Booking.belongsTo(Space, { foreignKey: 'spaceId' });
Space.hasMany(Booking,{foreignKey: 'spaceId'} );
User.hasMany(Booking,{foreignKey: 'userId'})

module.exports = { 
  Space, 
  Host, 
  Review, 
  User,
  Booking
};

// npx sequelize-cli db:migrate:undo --name 20240412084523-create-bookings.js
// // 