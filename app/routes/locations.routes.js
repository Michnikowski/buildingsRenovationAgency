module.exports = app => {
  const locations = require("../controllers/locations.controller.js");

  const router = require("express").Router();

  // Add new location
  router.post("/createLocation", locations.createLocation);

  // Edit location
  router.post("/edit/:id", locations.editLocation);

  // Remove single location
  router.post("/delete/:id", locations.deleteLocation);

  // Get locations with sorting option
  router.get("/field/:field/sort/:sort/page/:page", locations.findAll);

  app.use("/locations", router);
};
