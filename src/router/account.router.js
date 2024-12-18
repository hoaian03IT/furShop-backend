const express = require("express");
const router = express.Router();
const AccountController = require("../app/controller/Account");
const authen = require("../app/middlewares/authen");

router.post("/dang-ky", AccountController.register);
router.post("/dang-nhap", AccountController.login);
router.post("/auth/dang-xuat", authen, AccountController.logout);
router.get("/refresh-token/:id", AccountController.refreshToken);

router.post("/auth/doi-mat-khau", authen, AccountController.changePassword);

router.post("/auth/cap-nhat", authen, AccountController.updateProfile);

module.exports = router;
