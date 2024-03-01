const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");
const serverName = require("os").hostname();
const serverPort = process.env.PORT || 8080;

const ProductAttributeSchema = new Schema(
  {
    image: {
      type: String,
      default: `http://${serverName}:${serverPort}/api/hinh-anh?image=product-default.png`,
    },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductAttributeSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
});

module.exports = mongoose.model("ProductAttribute", ProductAttributeSchema);
