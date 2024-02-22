const express = require("express");
const router = express.Router();
const Category = require("../app/controller/Category");

router.get("/tat-ca", Category.getAll);
router.post("/tao-moi", Category.createCategory);

module.exports = router;
