const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = process.env;

function authen(req, res, next) {
    const token = req.headers["authorization"].split(" ")[0];
    if (!token) return res.status(401).json({ title: "Lỗi", message: "token rỗng" });
    jwt.verify(token, ACCESS_TOKEN, (err, data) => {
        if (err) {
            return res.status(401).json({ title: "Lỗi", message: "Token không hợp lệ" });
        }
        next();
    });
}

module.exports = authen;
