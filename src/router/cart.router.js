const Cart = require("../app/controller/Cart");
const authen = require("../app/middlewares/authen");

const routes = require("express").Router();

routes.post("/them-vao-gio-hang", authen, Cart.upload);
routes.post("/cap-nhat", authen, Cart.update);
routes.get("/xem-gio-hang", authen, Cart.get);
routes.delete("/xoa", authen, Cart.destroy);

module.exports = routes;
