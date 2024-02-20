const getImage = require('./getImage.route')
const Product = require('./product.router')
const Cart = require('./cart.router')
function router(app) {
    app.use('/hinh-anh',getImage)
    // app.use('/tai-khoan')
    app.use('/gio-hang',Cart)
    app.use('/',Product)
}

module.exports = router