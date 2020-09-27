module.exports = app => {
  const contractors = require("../controllers/contractors.controller.js");

  const router = require("express").Router();

  // Add new contractor
  router.post("/createContractor", contractors.createContractor);

  // Edit contractor
  router.post("/edit/:id", contractors.editContractor);

  // Remove single contractor
  router.post("/delete/:id", contractors.deleteContractor);

  // Get contractors with sorting option
  router.get("/field/:field/sort/:sort/page/:page", contractors.findAll);

  app.use("/contractors", router);
};
