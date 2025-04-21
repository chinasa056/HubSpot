require("dotenv").config();
const sequelize = require("./database/dbConnect");
require("./models/association");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const cron = require('node-cron');
const passport = require("passport")

require("./middleware/passport")
const session = require("express-session")
const userRouter = require('./routes/userRoute');
const spaceRoute = require("./routes/spaceRoute")
const subscriptionRoute = require("./routes/subscriptionRoute");
const favoriteRoute = require("./routes/favouriteRoute");
const bookingRoute = require("./routes/bookingRoute")
const reviewRoute = require("./routes/review")
const payoutRoute = require("./routes/payoutRoute")

const hostRoute = require('./routes/hostRoutes')
const PORT = process.env.PORT || 7039;

const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

app.use(session({
  saveUninitialized:false,
  secret: "HubSpot",
  resave: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/v1', userRouter);
app.use('/api/v1', spaceRoute);
app.use('/api/v1', subscriptionRoute);
app.use('/api/v1', hostRoute);
app.use('/api/v1', favoriteRoute);
app.use('/api/v1', bookingRoute);
app.use('/api/v1', reviewRoute);
app.use('/api/v1', payoutRoute);


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

app.use((error, req, res, next) => {
  if(error){
     return res.status(400).json({message:  error.message})
  }
  next()
})

const swaggerJsdoc = require("swagger-jsdoc");
const swagger_UI = require("swagger-ui-express");

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "HubSpot Documentation",
      version: '1.0.0',
      description: "Documentation for HubSpot, a platform simplifying the finding and bookin of co working hubs and creative spaces",
      license: {
        name: 'BASE_URL:https://hubspot-k95r.onrender.com',
      },
      contact: {
        name: "HubSpot",
         url: 'https://hubspot-liard.vercel.app/'
      }
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
           bearerFormat: "JWT"
        }
      }
    }, 
    security: [{ BearerAuth: [] }],
    servers: [
      {
        url: "https://hubspot-k95r.onrender.com",
        description: "Production Server"
      },
      {
        url: "http://localhost:7667",
        description: "Development Server"
      }
    ],
    
  },
  apis: ["./routes/*.js"]
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/appdocumentation", swagger_UI.serve, swagger_UI.setup(openapiSpecification))

// const { checkBookingStatusForAllSpaces } = require("./controllers/bookingController");

// cron.schedule("* * * * *", () => {
//   console.log("Running automated booking status check...");
//   checkBookingStatusForAllSpaces();
// }, {
//   scheduled: true,
//   timezone: "Africa/Lagos"
// });
app.listen(PORT, () => {
  console.log(`server is listening to port: ${PORT}`);
});
