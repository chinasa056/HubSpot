require("dotenv").config();
const sequelize = require("./database/dbConnect");
require("./models/association");
const express = require("express");
const cors = require("cors");
const userRouter = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const categoryRoute = require('./routes/categoryRoute');
const hostRoute = require('./routes/hostRoutes')
const PORT = process.env.PORT || 7039;

const app = express();

app.use(express.json());
app.use('/api/v1', userRouter);
app.use('/api/v1', adminRoute);
app.use('/api/v1', categoryRoute);
app.use('/api/v1', hostRoute);
app.use(cors());

const server = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');

    // // Sync all models with the database
    // await sequelize.sync({ alter: true });
    // console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

server();

app.listen(PORT, () => {
  console.log(`server is listening to port: ${PORT}`);
});
