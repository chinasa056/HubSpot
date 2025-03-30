const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('FlexiSpace', 'root', 'kelvin090', {
  host: 'localhost',
  dialect: "mysql"
});

// const sequelize = new Sequelize('database', 'username', 'password', {
//     host: 'localhost',
//     dialect: "mysql"
//   });
// npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js

// npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

module.exports = sequelize