const express = require("express");
const router = express.Router();
const Brand = require("../app/controller/Brand");

router.get("/pho-bien", Brand.getPopularBrand);
router.get("/:id", Brand.getOneBrand);
router.post("/tao-moi", Brand.createBrand);

module.exports = router;
