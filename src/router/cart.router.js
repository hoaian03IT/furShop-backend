const Cart = require('../app/controller/Cart');

const routes = require('express').Router();

routes.post('/them-vao-gio-hang',Cart.upload)
routes.get('/xem-gio-hang',Cart.get)
routes.delete('/xoa',Cart.destroy)

module.exports = routes