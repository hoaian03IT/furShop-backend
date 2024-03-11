const ProductModal = require("../model/product");
const CommentModal = require("../model/comment");
const OrderModal = require("../model/order");
class Comment {
    async createComment(req, res) {
        try {
            const { _id } = req.user;
            const { productId, star, comment } = req.body;
            const existedProduct = await ProductModal.findById(productId);
            if (!existedProduct) {
                return res.status(400).json({
                    title: "Lỗi",
                    message: "Sản phẩm không tồn tại",
                });
            }

            const isPurchased = await OrderModal.exists({ userId: _id, productId: productId });
            if (!isPurchased) {
                return res.status(400).json({
                    title: "Lỗi",
                    message: "Bạn phải mua sản phẩm mới có thể đánh giá",
                });
            }

            await CommentModal.create({ customerId: _id, productId: productId, comment: comment, star: star * 1 });
            res.status(200).json({ title: "Thành công", message: "Thành công" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getComments(req, res) {
        try {
            const { productId } = req.params;
            const comments = await CommentModal.find({ productId })
                .populate("customerId", "name image username")
                .select("customerId star comment createdAt");
            res.status(200).json({ comments });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new Comment();
