const express = require("express");
const router = express.Router();
const Product = require("../app/controller/Product");

router.post("/tao-moi", Product.createProduct);

module.exports = router;
