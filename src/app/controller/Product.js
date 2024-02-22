const BranchModel = require("../model/branch");
const CategoryModel = require("../model/category");
const ProductAttributeModel = require("../model/productAttribute");
const ProductModel = require("../model/product");

class Product {
    async createProduct(req, res) {
        try {
            const { productName, price, description, branchId, categoryId, discount, attributes } = req.body;
            const existedBranch = await BranchModel.exists({ _id: branchId });
            if (!existedBranch) {
                return res.status(400).json({
                    title: "Lỗi",
                    message: "Thương hiệu không hợp lệ",
                });
            }
            const existedCategory = await CategoryModel.exists({ _id: categoryId });
            if (!existedCategory) {
                return res.status(400).json({
                    title: "Lỗi",
                    message: "Danh mục không hợp lệ",
                });
            }

            const newAttributes = (await ProductAttributeModel.insertMany(attributes)).map((attr) => attr._id);
            console.log(newAttributes);

            await ProductModel.create({
                productName,
                price,
                description,
                discount,
                branch: branchId,
                category: categoryId,
                attributes: newAttributes,
            });
            res.status(200).json({ title: "Thành công", message: "Tạo sản phẩm thành công" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new Product();
