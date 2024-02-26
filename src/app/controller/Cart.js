const Cart = require("../model/cart");

class CartComtroller {
    async upload(req, res, next) {
        try {
            const { amount, customerId, productId, productAttributes } = req.body;
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

            const data = await Cart.updateOne(
                { customerId, productId, productAttributes },
                { $inc: { amount: amount } },
                { upsert: true, new: true }
            );

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
            console.log(req.user);
            const start = (pageNumber - 1) * limit;
            const data = await Cart.find({ customerId: _id }).skip(start).limit(limit);
            const quantity = await Cart.countDocuments({ customerId: _id });
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

module.exports = new CartComtroller();
