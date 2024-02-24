const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const CategorySchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
    },
    { timestamps: true }
);

CategorySchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true ,overrideMethods:true});

module.exports = mongoose.model("Category", CategorySchema);
