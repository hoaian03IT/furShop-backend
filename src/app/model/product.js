const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const ProductSchema = new Schema(
    {
        productName: { type: String, default: "Chưa cập nhật tên" },
        price: { type: Number, required: true },
        rate: { type: Array, default: [] },
        description: { type: String },
        branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        attributes: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductAttribute" }],
        discount: { type: Number, default: 0 },
        image:{type:Array}
    },
    { timestamps: true }
);

ProductSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true,overrideMethods:true });

module.exports = mongoose.model("Product", ProductSchema);