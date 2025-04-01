require("dotenv").config()
const { Sequelize } = require('sequelize');

const DB = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const dialect = process.env.DATABASE_DIALECT;

const sequelize = new Sequelize(DB, username, password, {
  host: host,
  dialect: dialect
});

module.exports = sequelize

// const sequelize = new Sequelize('database', 'username', 'password', {
//     host: 'localhost',
//     dialect: "mysql"
//   });
// npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js

// npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
