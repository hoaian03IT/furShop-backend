const Cart = require("../app/controller/Cart");
const authen = require("../app/middlewares/authen");

const routes = require("express").Router();

routes.post("/them-vao-gio-hang", Cart.upload);
routes.get("/xem-gio-hang", authen, Cart.get);
routes.delete("/xoa", Cart.destroy);

module.exports = routes;
