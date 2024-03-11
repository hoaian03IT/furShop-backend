const express = require("express");
const router = express.Router();
const Product = require("../app/controller/Product");
const authen = require("../app/middlewares/authen");

router.get("/loc-san-pham", Product.filterProduct);
router.get("/lay-san-pham-moi", Product.getProducts);
router.get("/:id", Product.getProduct);
router.post("/tao-moi", authen, Product.createProduct);
router.get("/tim-kiem", Product.searchProduct);

module.exports = router;
