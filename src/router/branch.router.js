const express = require("express");
const router = express.Router();
const Branch = require("../app/controller/Branch");

router.post("/tao-moi", Branch.createBranch);

module.exports = router;
