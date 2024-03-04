const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const shopSchema = new Schema(
    {
        name: { type: String, required: true },
        tagname: { type: String, required: true, unique: true },
        owner: { type: mongoose.Types.ObjectId, required: true, unique: true },
        shopAvatar: { type: String, required: true },
        backgroundImage: { type: String, required: true },
    },
    { timestamps: true }
);

shopSchema.plugin(mongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

module.exports = mongoose.model("Shop", shopSchema);
