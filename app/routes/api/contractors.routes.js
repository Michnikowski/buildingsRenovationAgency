module.exports = app => {
  const contractors = require("../../controllers/api/contractors.controller.js");

  const router = require("express").Router();

  // Create a new contractor
  router.post("/", contractors.create);

  // Retrieve all contractors
  router.get("/", contractors.findAll);

  // Retrieve a single contractor with id
  router.get("/:id", contractors.findOne);

  // Delete a contractor with id
  router.delete("/:id", contractors.delete);

  // Delete all contractors
  router.delete("/", contractors.deleteAll);

  app.use("/api/contractors", router);
};
