const getImage = require("./getImage.route");
const Product = require("./product.router");
const Account = require("./account.router");
const Category = require("./category.router");
const Cart = require("./cart.router");
const Brand = require("./brand.router");
const Order = require("./order.router");
const Shop = require("./shop.router");

function router(app) {
    app.use("/api/hinh-anh", getImage);
    app.use("/api/tai-khoan", Account);
    app.use("/api/loai-muc", Category);
    app.use("/api/thuong-hieu", Brand);
    app.use("/api/gio-hang", Cart);
    app.use("/api/san-pham", Product);
    app.use("/api/don-hang", Order);
    app.use("/api/cua-hang", Shop);
}

module.exports = router;
