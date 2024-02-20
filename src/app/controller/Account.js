const { userRoles, userGender } = require("../../constant");
const { generateRefreshToken, generateAccessToken } = require("../../utils/generationToken");
const isEmail = require("../../utils/isEmail");
const checkPassword = require("../../utils/checkPassword");
const AccountModal = require("../model/account");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class Account {
    async register(req, res) {
        const {
            email: emailPayload,
            password: passwordPayload,
            username: usernamePayload,
            role: rolePayload,
            gender: genderPayload,
        } = req.body;

        if (!isEmail(emailPayload))
            return res.status(403).json({
                title: "Lỗi cú pháp",
                message: "Tên đăng nhập không hợp lệ",
            });
        if (!checkPassword(passwordPayload))
            return res.status(403).json({
                title: "Lỗi cú pháp",
                message: "Mật khẩu không hợp lệ",
            });

        const hasExistEmail = await AccountModal.exists({ email: emailPayload });

        if (hasExistEmail)
            return res.status(403).json({
                title: "Lỗi cú pháp",
                message: "Email đã tồn tại",
            });

        const hasExistUsername = await AccountModal.exists({ username: usernamePayload });
        if (hasExistUsername)
            return res.status(403).json({
                title: "Lỗi cú pháp",
                message: "Username đã tồn tại",
            });

        if (!userRoles.includes(rolePayload))
            return res.status(403).json({
                title: "Lỗi cú pháp",
                message: "Quyền không hợp lệ",
            });

        if (!userGender.includes(genderPayload)) {
            return res.status(403).json({
                title: "Lỗi cú pháp",
                message: "Giới tính không hợp lệ",
            });
        }

        //  create new account
        const hashPassword = await bcrypt.hash(passwordPayload, saltRounds);
        let newUser = await AccountModal.create({
            email: emailPayload,
            username: usernamePayload,
            password: hashPassword,
            role: rolePayload,
            gender: genderPayload,
        });

        // create tokens
        const refreshToken = generateRefreshToken(newUser._id);
        const accessToken = generateAccessToken(newUser._id);

        // update refresh token for new user
        newUser = await AccountModal.findByIdAndUpdate(newUser._id, { token: [refreshToken] });

        const { username, role, email, phone, gender, image } = newUser;

        res.status(200).json({ user: { username, role, email, phone, gender, image, token: accessToken } });
    }
}

module.exports = new Account();
