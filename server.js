require("dotenv").config();
const sequelize = require("./database/dbConnect")
const express = require("express");
const cors = require("cors")

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors())

const server = async()=> {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
 server()
app.listen(PORT, () => {
  console.log(`server is listening to port: ${PORT}`);

})