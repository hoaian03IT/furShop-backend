const express = require("express");
const getImage = require("../app/controller/getImage");
const routes = express.Router();

routes.get("/", getImage);

module.exports = routes;
