const mongoose = require("mongoose");
const ShopModel = require("../model/shop");
const ProductModal = require("../model/product");
const CommentModal = require("../model/comment");

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

    async getInfo(req, res) {
        try {
            const { filter, limit = 12, tagname } = req.query;
            const filterProduct = filter === "newest" ? { createdAt: 1 } : filter === "sale" ? { discount: -1 } : {};
            const discountFilter = { discount: { $gt: 0 } };
            const shop = await ShopModel.findOne({ tagname }).select("name tagname backgroundImage shopAvatar");
            let products = await ProductModal.find({ shop: shop._id, ...discountFilter })
                .populate("attributes", "image color size quantity")
                .populate("brand", "name description")
                .populate("category", "name description")
                .sort({ ...filterProduct })
                .select("productName price rate description brand category attributes discount shop");
            const soldProduct = products.reduce(
                (acc, cur) => {
                    const soldAttributes =
                        cur.attributes.reduce((prev, cur) => prev + Number(cur.sold ? 0 : cur.sold || 0), [0]) || 0;
                    return Number(acc) + Number(soldAttributes);
                },
                [0]
            );

            if (filter !== "all") products = products.slice(0, limit);

            const countDocuments = await ProductModal.countDocuments({ shop: shop._id });

            res.status(200).json({
                shopInfo: { ...shop._doc, sold: soldProduct, totalProduct: countDocuments },
                products: products,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new Shop();
