const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const BranchSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
    },
    { timestamps: true }
);

BranchSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true });

module.exports = mongoose.model("Branch", BranchSchema);
