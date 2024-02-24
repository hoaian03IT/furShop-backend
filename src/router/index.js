const getImage = require("./getImage.route");
const Product = require("./product.router");
const Account = require("./account.router");
const Category = require("./category.router");
const Cart = require("./cart.router");
const Branch = require("./branch.router");
const Order = require("./order.router");

function router(app) {
    app.use("/api/hinh-anh", getImage);
    app.use("/api/tai-khoan", Account);
    app.use("/api/loai-muc", Category);
    app.use("/api/thuong-hieu", Branch);
    app.use("/api/gio-hang", Cart);
    app.use("/api/san-pham", Product);
    app.use('/api/don-hang',Order)
}

module.exports = router;
