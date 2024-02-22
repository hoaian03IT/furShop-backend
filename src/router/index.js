const getImage = require("./getImage.route");
const Product = require("./product.router");
const Account = require("./account.router");
const Category = require("./category.router");
const Branch = require("./branch.router");

function router(app) {
    app.use("/hinh-anh", getImage);
    app.use("/tai-khoan", Account);
    app.use("/loai-muc", Category);
    app.use("/thuong-hieu", Branch);
    app.use("/san-pham", Product);
}

module.exports = router;
