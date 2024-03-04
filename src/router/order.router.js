const routes = require('express').Router()
const OrderController = require('../app/controller/order')
const authen = require('../app/middlewares/authen')

routes.post('/dat-hang',authen,OrderController.create)
routes.get('/xem-tat-ca-don-hang',authen,OrderController.getOrders)
routes.get('/xem-don-hang',authen,OrderController.getOrder)
routes.delete('/huy-don-hang',authen,OrderController.cancelOrder)


module.exports  = routes