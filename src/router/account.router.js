const express = require("express");
const routes = express.Router();
const AccountController = require("../app/controller/Account");

routes.post("/dang-ky", AccountController.register);

module.exports = routes;
