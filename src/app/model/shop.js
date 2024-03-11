const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const shopSchema = new Schema(
    {
        name: { type: String, required: true },
        tagname: { type: String, required: true, unique: true },
        owner: { type: mongoose.Types.ObjectId, required: true, unique: true },
        shopAvatar: {
            type: String,
            default: "https://i.pinimg.com/474x/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.jpg",
        },
        backgroundImage: {
            type: String,
            default: "https://img.freepik.com/free-photo/shopping-bag-cart_23-2148879372.jpg",
        },
    },
    { timestamps: true }
);

shopSchema.plugin(mongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
});

module.exports = mongoose.model("Shop", shopSchema);
