const jwt = require("jsonwebtoken");

function authen(req, res, next) {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) return res.status(401).json({ title: "Lỗi", message: "Token rỗng" });
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({ title: "Lỗi", message: "Token không hợp lệ" });
        }
        req.user = user;
        next();
    });
}

module.exports = authen;
