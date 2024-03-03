const express = require("express");
const router = express.Router();
const Shop = require("../app/controller/Shop");
const authen = require("../app/middlewares/authen");
const { providerRole } = require("../app/middlewares/author");

router.post("/tao-cua-hang", authen, providerRole, Shop.createShop);

module.exports = router;
