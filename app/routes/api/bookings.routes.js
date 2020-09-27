module.exports = app => {
  const bookings = require("../../controllers/api/bookings.controller.js");

  const router = require("express").Router();

  // Create a new booking
  router.post("/", bookings.create);

  // Retrieve all bookings
  router.get("/", bookings.findAll);

  // Retrieve a single booking with id
  router.get("/:id", bookings.findOne);

  // Delete a booking with id
  router.delete("/:id", bookings.delete);

  // Delete all bookings
  router.delete("/", bookings.deleteAll);

  app.use("/api/bookings", router);
};
