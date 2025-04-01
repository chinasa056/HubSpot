const Space = require('./space');
const Category = require('./category');
const Host = require('./host');
const Location = require('./location');
const Review = require('./review_rating');
const Subscription = require('./subscription');
const Plan = require('./plan');
const Booking = require('./booking');
const User = require('./user');

// Set associations
Category.hasMany(Space, { foreignKey: 'categoryId' });
Space.belongsTo(Category, { foreignKey: 'categoryId' });

Host.hasMany(Space, { foreignKey: 'hostId' });
Space.belongsTo(Host, { foreignKey: 'hostId' });

Space.belongsTo(Location, { foreignKey: 'locationId' });
Location.hasMany(Space, { foreignKey: 'locationId' });


Review.belongsTo(Space, { foreignKey: 'spaceId' });
Space.hasMany(Review, { foreignKey: 'spaceId' });

Subscription.belongsTo(Host, { foreignKey: 'hostId' });
Subscription.belongsTo(Plan, { foreignKey: 'planId' });

Booking.belongsTo(User, { foreignKey: 'userId' });
Booking.belongsTo(Space, { foreignKey: 'spaceId' });

module.exports = { 
  Category, 
  Space, 
  Host, 
  Location, 
  Review, 
  Subscription, 
  Plan 
};
