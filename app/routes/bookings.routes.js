module.exports = app => {
  const bookings = require("../controllers/bookings.controller.js");

  const router = require("express").Router();

  // Open form company and location (create new booking)
  router.post("/nextStep/:nextStep", bookings.findAll);

  // Add new booking step II
  router.post("/createBooking", bookings.createBooking);

  // Remove single booking
  router.post("/delete/:id", bookings.deleteBooking);

  // Get bookings with sorting option
  router.get("/field/:field/sort/:sort/page/:page", bookings.findAll);

  app.use("/bookings", router);
};
