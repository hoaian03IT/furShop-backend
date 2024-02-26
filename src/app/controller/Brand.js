const BrandModel = require("../model/brand");

class Brand {
    async createBrand(req, res) {
        try {
            const { newBrand, description } = req.body;
            const hasExistBrand = await BrandModel.exists({ name: newBrand });
            if (hasExistBrand) {
                return res.status(400).json({
                    title: "Lỗi",
                    message: "Brand đã tồn tại",
                });
            }
            await BrandModel.create({
                name: newBrand,
                description,
                quantity: 0,
            });
            return res.status(200).json({
                title: "Thành công",
                message: "Thêm mới thành công",
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getPopularBrand(req, res) {
        try {
            const { limit = 5 } = req.query;
            // query cac brands khác
            const otherBrands = await BrandModel.findOne({ name: "Khác" }).select("name description quantity");

            //$nin: duoc dung de loai tru nhung tap co chua gia tri $nin
            const brands = await BrandModel.find({ _id: { $nin: otherBrands._id } })
                .sort("-quantity")
                .limit(limit - 1)
                .select("name description quantity");
            brands.push(otherBrands);
            res.status(200).json({ brands });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getOneBrand(req, res) {
        try {
            const { id } = req.params;
            const brand = await BrandModel.findById(id);
            res.status(200).json({ brand });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new Brand();
