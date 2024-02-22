const CategoryModel = require("../model/category");
const ProductModel = require("../model/product");

class Category {
    async createCategory(req, res) {
        try {
            const { newCategory, description } = req.body;
            const hasExistCategory = await CategoryModel.exists({ name: newCategory });
            if (hasExistCategory) {
                return res.status(400).json({
                    title: "Lỗi",
                    message: "Tên danh mục đã tồn tại",
                });
            }
            await CategoryModel.create({
                name: newCategory,
                description,
            });

            res.status(200).json({
                title: "Thành công",
                message: "Tạo danh mục mới thành công",
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getAll(req, res) {
        try {
            const data = await ProductModel.aggregate({
                $lookup: { from: "Category", localField: "category", foreignField: "_id", as: "categoryId" },
            });

            res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new Category();
