const mongoose = require("mongoose");
const ShopModel = require("../model/shop");

class Shop {
    async createShop(req, res) {
        try {
            const {
                name: namePayload,
                tagname: tagnamePayload,
                shopAvatar: shopAvatarPayload,
                backgroundImage: backgroundImagePayload,
            } = req.body;
            const { _id: userId } = req.user;
            let existedShop = await ShopModel.exists({ tagname: tagnamePayload });
            if (existedShop) {
                return res.status(400).json({ title: "Thất bại", message: "Tagname đã được sử dụng" });
            }
            existedShop = await ShopModel.exists({ owner: userId });
            if (existedShop) {
                return res
                    .status(400)
                    .json({ title: "Thất bại", message: "Một tài khoản chỉ đăng ký được một của hàng" });
            }
            const newShop = await ShopModel.create({
                name: namePayload,
                tagname: tagnamePayload,
                shopAvatar: shopAvatarPayload,
                backgroundImage: backgroundImagePayload,
                owner: new mongoose.Types.ObjectId(userId),
            });
            const { _id, name, tagname, shopAvatar, backgroundImage } = newShop._doc;
            res.status(200).json({ _id, name, tagname, shopAvatar, backgroundImage });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new Shop();
