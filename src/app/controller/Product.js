const BrandModel = require("../model/brand");
const CategoryModel = require("../model/category");
const ProductAttributeModel = require("../model/productAttribute");
const ProductModel = require("../model/product");

class Product {
    async createProduct(req, res) {
        try {
            const { productName, price, description, brandId, categoryId, discount, attributes } = req.body;
            const { _id } = req.user;
            const existedBrand = await BrandModel.findById(brandId);
            if (!existedBrand) {
                return res.status(400).json({
                    title: "Lỗi",
                    message: "Thương hiệu không hợp lệ",
                });
            }
            const existedCategory = await CategoryModel.findById(categoryId);
            if (!existedCategory) {
                return res.status(400).json({
                    title: "Lỗi",
                    message: "Danh mục không hợp lệ",
                });
            }

            const quantity = attributes?.reduce((acc, curr) => acc + curr.quantity, 0);

            const newAttributes = (await ProductAttributeModel.insertMany(attributes)).map((attr) => attr._id);

            await ProductModel.create({
                provider: _id,
                productName,
                price,
                description,
                discount,
                brand: brandId,
                category: categoryId,
                attributes: newAttributes,
            });

            await BrandModel.findByIdAndUpdate(existedBrand._id, {
                quantity: existedBrand.quantity + quantity,
            });
            await CategoryModel.findByIdAndUpdate(existedCategory._id, {
                quantity: existedCategory.quantity + quantity,
            });

            res.status(200).json({ title: "Thành công", message: "Tạo sản phẩm thành công" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProduct(req, res) {
        try {
            const { id } = req.params;
            const existedProduct = await ProductModel.exists({ _id: id });
            if (!existedProduct) {
                return res.status(400).json({
                    title: "Lỗi",
                    message: "Sản phẩm không hợp lệ",
                });
            }
            // populate(field, fieldSelection) - fieldSelection includes _id field
            const product = await ProductModel.findById(id)
                .populate("attributes", "image color size quantity")
                .populate("brand", "name description")
                .populate("category", "name description")
                .populate("shop", "name tagname")
                .select("productName price rate description brand category attributes discount");
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async filterProduct(req, res) {
        try {
            const PAGE_SIZE = 3;
            const {
                category = "",
                order = "",
                brand = "",
                price = "",
                query: searchQuery = "",
                pageSize = PAGE_SIZE,
                page = 1,
            } = req.query;
            const queryFilter =
                searchQuery && searchQuery !== "all"
                    ? {
                          productName: {
                              $regex: searchQuery,
                              $options: "i",
                          },
                      }
                    : {};

            const categoryFilter = category && category !== "all" ? { category } : {};
            const priceFilter =
                price && price !== "all"
                    ? price.split("-")[0] === "over"
                        ? {
                              price: {
                                  $gte: Number(price.split("-")[1]), // greatest
                              },
                          }
                        : {
                              price: {
                                  $gte: Number(price.split("-")[0]), // greatest
                                  $lte: Number(price.split("-")[1]) || -1, // least
                              },
                          }
                    : {};
            const brandFilter = brand && brand !== "all" ? { brand } : {};
            const sortOrder =
                order === "asc"
                    ? { productName: 1 }
                    : order === "desc"
                    ? { productName: -1 }
                    : order === "lowest"
                    ? { price: 1 }
                    : order === "highest"
                    ? { price: -1 }
                    : order === "newest"
                    ? { createdAt: 1 }
                    : { _id: 1 };

            const products = await ProductModel.find({
                ...queryFilter,
                ...categoryFilter,
                ...priceFilter,
                ...brandFilter,
            })
                .sort(sortOrder)
                .skip(pageSize * (page - 1))
                .limit(pageSize)
                .populate("attributes", "image color size quantity")
                .populate("brand", "name description")
                .populate("category", "name description")
                .populate("shop", "name tagname")
                .select("productName price rate description brand category attributes discount shop")
                .exec();

            const countProducts = await ProductModel.countDocuments({
                ...queryFilter,
                ...categoryFilter,
                ...priceFilter,
                ...brandFilter,
            });

            res.status(200).json({
                products,
                page,
                pages: Math.ceil(countProducts / pageSize),
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProducts(req, res) {
        try {
            const { limit = 4 } = req.query;
            const products = await ProductModel.find({}).limit(limit);
            return res.status(200).json({
                data: products,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async searchProduct(req, res) {
        try {
            const { name, color, size } = req.query;

            console.log(name);

            const res = await ProductModel.find({
                productName: {
                    $regex: name,
                    $options: "i",
                },
            });

            res.status(200).json(res);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new Product();
