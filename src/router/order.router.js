const routes = require('express').Router()
const OrderController = require('../app/controller/order')

routes.post('/dat-hang',OrderController.create)
routes.get('/xem-tat-ca-don-hang',OrderController.getOrders)
routes.get('/xem-don-hang',OrderController.getOrder)
routes.delete('/huy-don-hang',OrderController.cancelOrder)


module.exports  = routes