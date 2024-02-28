const express = require("express");
const router = express.Router();
const Product = require("../app/controller/Product");

router.get("/loc-san-pham", Product.filterProduct);
router.get("/lay-san-pham-moi", Product.getProducts);
router.get("/:id", Product.getProduct);
router.post("/tao-moi", Product.createProduct);

module.exports = router;
