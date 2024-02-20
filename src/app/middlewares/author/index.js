const Account = require("../../model/account");

async function checkRole(req) {
    const userName = req.body.userName || req.query.userName;
    const account = await Account.findOne({ userName: userName });
    return account.role;
}

async function adminRole(req, res, next) {
    const role = await checkRole(req);
    if (role === "admin") {
        next();
    }
    return res.status(401).json({
        title: "không đủ quyền",
        message: "Bạn không đủ quyền để truy cập vào quyền admin",
    });
}
async function providerRole(req, res, next) {
    const role = await checkRole(req);
    if (role === "provider" || role === "admin") {
        next();
    }
    return res.status(401).json({
        title: "không đủ quyền",
        message: "Bạn không đủ quyền để truy cập vào quyền provider",
    });
}

module.exports = { providerRole, adminRole };
