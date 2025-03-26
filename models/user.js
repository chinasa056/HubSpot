const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model {}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4

    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false

    },
    email: {
      type: DataTypes.STRING,
      allowNull: false

    },
    prifilePiture:{
         type:DataTypes.String,
         allowNull:false

    },
    isVerified:{
      type:Boolean,
      default:false 
    },
    gender:{
     type:DataTypes.ENUM('Male','Female'),
     allowNull:false
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User', // We need to choose the model name
    timestamps: true,
  },
);

module.exports = User
