const Account = require("../../model/account");

async function checkRole(_id) {
    const account = await Account.findById(_id);
    return account.role;
}

async function adminRole(req, res, next) {
    const role = await checkRole(req.user._id);
    if (role === "admin") {
        return next();
    }
    return res.status(401).json({
        title: "không đủ quyền",
        message: "Bạn không đủ quyền để truy cập vào quyền admin",
    });
}
async function providerRole(req, res, next) {
    const role = await checkRole(req.user._id);
    if (role === "provider" || role === "admin") {
        req.role = role;
        return next();
    }
    return res.status(401).json({
        title: "không đủ quyền",
        message: "Bạn không đủ quyền để truy cập vào quyền provider",
    });
}

module.exports = { providerRole, adminRole };
