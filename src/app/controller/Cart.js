const Cart = require("../model/cart");

class CartController {
    async upload(req, res, next) {
        try {
            const { _id: customerId } = req.user;
            const { amount, productId, productAttributes } = req.body;
            console.log(amount);
            if (!amount || !customerId || !productId || !productAttributes) {
                return res.status(400).json({
                    title: "Lỗi",
                    message: "Thông tin thiếu",
                });
            }
            if (amount <= 0)
                return res.status(401).json({
                    title: "Lỗi",
                    message: "Số lượng sản phẩm phải lớn hơn 0",
                });

            const data = await Cart.findOneAndUpdate(
                { customerId, productId, productAttributes },
                { amount: amount },
                { upsert: true, new: true }
            )
                .populate("productId")
                .populate("productAttributes");

            if (data.upsertedCount <= 0 && data.modifiedCount <= 0)
                return res.status(400).json({
                    title: "Thất bại",
                    message: "Thêm sản phẩm thất bại",
                });
            return res.status(200).json({
                title: "Thành công",
                data,
            });
        } catch (error) {
            return res.status(500).json({
                title: "Lỗi",
                message: error.message,
            });
        }
    }
    async update(req, res) {
        try {
            const { cartId, amount } = req.body;
            if (amount <= 0) {
                return res.status(401).json({
                    title: "Lỗi",
                    message: "Số lượng sản phẩm phải lớn hơn 0",
                });
            }
            if (!cartId)
                return res.status(400).json({
                    title: "Lỗi",
                    message: "Không tìm thấy Id cart",
                });
            const data = await Cart.updateOne({ _id: cartId }, { amount: amount }, { new: true });
            if (data.modifiedCount)
                return res.status(200).json({
                    success: true,
                    data,
                });
            return res.status(400).json({
                title: "Lỗi",
                message: "Cập nhật thất bại",
            });
        } catch (error) {
            return res.status(500).json({
                title: "Lỗi",
                message: error.message,
            });
        }
    }
    async get(req, res) {
        try {
            const { pageNumber = 1, limit = 5 } = req.query;
            const { _id } = req.user;
            const start = (pageNumber - 1) * limit;
            const data = await Cart.find({ customerId: _id, amount: { $gt: 0 } })
                .skip(start)
                .limit(limit)
                .populate("productId")
                .populate("productAttributes");
            const quantity = await Cart.countDocuments({
                customerId: _id,
                amount: { $gt: 0 },
            });
            const numberPage = Math.floor(quantity / limit) + (quantity % limit) !== 0 ? 1 : 0;
            return res.status(200).json({
                title: "Thành công",
                message: "Xem giỏ hàng",
                data: data,
                numberPage,
                currentPage: pageNumber,
            });
        } catch (error) {
            return res.status(500).json({
                title: "Lỗi",
                message: error.message,
            });
        }
    }
    async destroy(req, res) {
        try {
            const { cartId } = req.body;
            if (!cartId)
                return res.status(400).json({
                    title: "Lỗi",
                    message: "không tìm thấy cart id",
                });
            const data = await Cart.deleteOne({ _id: cartId });
            if (data.deletedCount)
                return res.status(200).json({
                    title: "Thành công",
                    message: "Xóa sản phẩm thành công",
                    data,
                });
            return res.status(400).json({
                title: "Thất bại",
                message: "Xóa thất bại",
            });
        } catch (error) {
            return res.status(error.status).json({
                title: "Lỗi",
                message: error.message,
            });
        }
    }
}

module.exports = new CartController();
