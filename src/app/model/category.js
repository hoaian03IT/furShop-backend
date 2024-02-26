const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const CategorySchema = new Schema(
    {
        image: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String },
        quantity: { type: Number, required: true },
    },
    { timestamps: true }
);

CategorySchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true, overrideMethods: true });

module.exports = mongoose.model("Category", CategorySchema);
