const getImage = require("./getImage.route");
const Product = require("./product.router");
const Account = require("./account.router");

function router(app) {
    app.use("/hinh-anh", getImage);
    app.use("/tai-khoan", Account);
    // app.use("/", Product);
}

module.exports = router;
