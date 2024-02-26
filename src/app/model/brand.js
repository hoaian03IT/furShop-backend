const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const BrandSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        quantity: { type: Number, required: true },
    },
    { timestamps: true }
);

BrandSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true, overrideMethods: true });

module.exports = mongoose.model("Brand", BrandSchema);
