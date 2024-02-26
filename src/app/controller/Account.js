const { userRoles, userGender } = require("../../constant");
const { generateRefreshToken, generateAccessToken } = require("../../utils/generationToken");
const isEmail = require("../../utils/isEmail");
const checkPassword = require("../../utils/checkPassword");
const AccountModal = require("../model/account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

class Account {
    async register(req, res) {
        try {
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
                    message: "Email không hợp lệ",
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

            // save refresh token as cookie
            res.cookie("refresh-token", refreshToken, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "strict",
                expires: new Date(Date.now() + 30 * 24 * 3600000), // 30 days
            });

            const { username, role, email, phone, gender, image } = newUser;

            return res.status(200).json({ user: { username, role, email, phone, gender, image, token: accessToken } });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email: emailPayload, password } = req.body;
            if (!isEmail(emailPayload))
                return res.status(403).json({
                    title: "Lỗi cú pháp",
                    message: "Email không hợp lệ",
                });
            if (!checkPassword(password))
                return res.status(403).json({
                    title: "Lỗi cú pháp",
                    message: "Mật khẩu không hợp lệ",
                });
            let user = await AccountModal.findOne({ email: emailPayload });
            if (!user) {
                return res.status(403).json({
                    title: "Lỗi ",
                    message: "Email hoặc mật khẩu không đúng",
                });
            }

            const isMatchPW = await bcrypt.compare(password, user.password);
            if (!isMatchPW) {
                return res.status(403).json({
                    title: "Lỗi ",
                    message: "Email hoặc mật khẩu không đúng",
                });
            }

            // create tokens
            const refreshToken = generateRefreshToken(user._id);
            const accessToken = generateAccessToken(user._id);

            // update refresh token for new user
            user = await AccountModal.findByIdAndUpdate(user._id, { token: [...user.token, refreshToken] });

            // save refresh token as cookie
            res.cookie("refresh-token", refreshToken, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "strict",
                expires: new Date(Date.now() + 30 * 24 * 3600000), // 30 days
            });

            const { username, role, email, phone, gender, image } = user;
            return res.status(200).json({ user: { username, role, email, phone, gender, image, token: accessToken } });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async logout(req, res) {
        try {
            const refreshToken = req.cookies["refresh-token"];
            if (!refreshToken) {
                return res.status(401).json({
                    title: "Lỗi",
                    message: "Lỗi xác thực 1",
                });
            }
            const { _id } = req.user;
            console.log(req.user);
            const user = await AccountModal.findById(_id);
            if (!user.token.includes(refreshToken)) {
                return res.status(401).json({
                    title: "Lỗi",
                    message: "Lỗi xác thực 2",
                });
            }

            const newTokens = user.token.filter((token) => token !== refreshToken);

            await AccountModal.findByIdAndUpdate(_id, { token: newTokens });

            res.status(200).json({});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies["refresh-token"];
            const { id } = req.params;

            if (!refreshToken) {
                return res.status(401).json({
                    title: "Lỗi",
                    message: "Lỗi xác thực 1",
                });
            }

            const user = await AccountModal.findById(id);

            if (!user.token.includes(refreshToken)) {
                return res.status(401).json({
                    title: "Lỗi",
                    message: "Lỗi xác thực 2",
                });
            }

            const newTokens = user.token.filter((token) => token !== refreshToken);

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err)
                    return res.status(401).json({
                        title: "Lỗi",
                        message: "Lỗi xác thực 3",
                    });

                const newRefreshToken = generateRefreshToken(user._id);
                const accessToken = generateAccessToken(user._id);

                newTokens.push(newRefreshToken);

                res.cookie("refresh-token", newRefreshToken, {
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    httpOnly: true,
                    secure: true,
                });

                await AccountModal.findByIdAndUpdate(id, { token: newTokens });
                res.status(200).json({ token: accessToken });
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new Account();
