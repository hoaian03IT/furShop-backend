const jwt = require("jsonwebtoken");

const generateAccessToken = (_id) => {
    return jwt.sign({ _id }, process.env.ACCESS_TOKEN, { expiresIn: "1m" });
};

const generateRefreshToken = (_id) => {
    return jwt.sign({ _id }, process.env.REFRESH_TOKEN, { expiresIn: "30d" });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
