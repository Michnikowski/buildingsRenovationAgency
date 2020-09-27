const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const handlebars = require('express-handlebars');

const path = require("path")

const logger = require('./middleware/logger')
const morgan = require('morgan')
const colors = require('colors');

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.urlencoded({
  extended: true
}))

app.use(express.static(path.join(__dirname, 'public')));

const db = require("./app/models");

//{ alter: true } or { force: true }
// db.sequelize.sync({
//   force: true
// }).then(() => {
//   console.log("Drop and re-sync db.");
// });


// handlebars
app.set('view engine', 'hbs');

app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'default',
  partialsDir: __dirname + '/views/partials',
  helpers: {
    date: require('helper-date'),
    compare: (a, b, c) => {
      if(a === b){
        return c;
      }else{
        return false;
      }}
  }
}));

/// DEV logging middleware
app.use(morgan('dev'));

// API
require("./app/routes/api/contractors.routes")(app);
require("./app/routes/api/locations.routes")(app);
require("./app/routes/api/bookings.routes")(app);

// MAIN
require("./app/routes/contractors.routes")(app);
require("./app/routes/locations.routes")(app);
require("./app/routes/bookings.routes")(app);
require("./app/routes/home.routes")(app);

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(__dirname)
  console.log(`Server is running on port ${PORT}\nhttp://localhost:${PORT}` .blue)
})
