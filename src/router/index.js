const getImage = require('./getImage.route')
const Product = require('./product.router')

function router(app) {
    app.use('/hinh-anh',getImage)
    app.use('/tai-khoan')
    app.use('/',Product)
}

module.exports = router