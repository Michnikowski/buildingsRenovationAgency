module.exports = app => {
  const locations = require("../../controllers/api/locations.controller.js");

  const router = require("express").Router();

  // Create a new location
  router.post("/", locations.create);

  // Retrieve all locations
  router.get("/", locations.findAll);

  // Retrieve a single location with id
  router.get("/:id", locations.findOne);

  // Delete a location with id
  router.delete("/:id", locations.delete);

  // Delete all locations
  router.delete("/", locations.deleteAll);

  app.use("/api/locations", router);
};
