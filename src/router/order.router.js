const routes = require('express').Router()
const OrderController = require('../app/controller/order')
const authen = require('../app/middlewares/authen')

routes.post('/dat-hang',authen,OrderController.create)
routes.get('/xem-tat-ca-don-hang',OrderController.getOrders)
routes.get('/xem-don-hang',OrderController.getOrder)
routes.delete('/huy-don-hang',OrderController.cancelOrder)


module.exports  = routes