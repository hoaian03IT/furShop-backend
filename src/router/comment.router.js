const express = require("express");
const router = express.Router();
const Comment = require("../app/controller/Comment");
const authen = require("../app/middlewares/authen");

router.post("/tao-binh-luan", authen, Comment.createComment);
router.get("/lay/:productId", Comment.getComments);

module.exports = router;
