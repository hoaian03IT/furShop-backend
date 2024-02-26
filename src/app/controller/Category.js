const CategoryModel = require("../model/category");

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
                quantity: 0,
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
            const categories = await CategoryModel.find({}).select("image name description quantity").sort("-quantity");

            res.status(200).json({ categories });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async filterCategory(req, res) {
        try {
            const { query } = req.query;
            const categories = await CategoryModel.find({ name: { $regex: query, $option: "i" } });
            res.status(200).json({ categories });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getMost(req, res) {}
}

module.exports = new Category();
