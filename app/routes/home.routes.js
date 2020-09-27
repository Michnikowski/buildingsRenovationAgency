module.exports = app => {
  const home = require("../controllers/home.controller.js");

  const router = require("express").Router();

  router.get("/home", home.getHome);
  router.get("/", home.getHome);

  app.use("/", router);
};
