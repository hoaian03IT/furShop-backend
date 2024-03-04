const cart = require("../model/cart");
const category = require("../model/category");
const Order = require("../model/order");
const Product = require("../model/product");
const ProductAttribute = require("../model/productAttribute");

class OrderController {
  async create(req, res, next) {
    try {
      const {
        name,
        product,
        customerId,
        address,
        phoneNumber,
        paymentType = 0,
      } = req.body;
      // const {_id:customerId} = req.user
      let PromiseSave = [];
      for (let i = 0; i < product.length; i++) {
        const {
          productId = null,
          amount = 0,
          productAttributeId = null,
        } = product[i];
        const { quantity = 0 } = await ProductAttribute.findById(
          productAttributeId
        );
        if (quantity <= 0)
          continue;
        // console.log(name, amount, productAttributeId,customerId, productAttribute, quantity);
        if (
          !name ||
          !productId ||
          !customerId ||
          !amount ||
          !address ||
          !phoneNumber ||
          !productAttributeId
        ) {
          return res.status(400).json({ message: "Invalid input data" });
        }
        const order = new Order({
          name,
          paymentType,
          productId,
          customerId,
          amount,
          address,
          phoneNumber,
          productAttribute: productAttributeId,
        });
        const saveOrder = order.save();
        const updateProduct = ProductAttribute.updateOne(
          { _id: productAttributeId },
          { $inc: { quantity: -amount } },
          { new: true }
        );
        const productCategory = await Product.findById(productId);
        const updateCategory = await category.updateOne(
          { _id: productCategory?.category },
          { $inc: { quantity: -amount } }
        );
        PromiseSave.push(saveOrder);
        PromiseSave.push(updateProduct);
      }
      const [data, updateNumber] = await Promise.all([...PromiseSave]);
      const cartDelete = await cart.delete({});
      return res.status(200).json({
        message: "thanh cong",
        success: true,
        data:cartDelete
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  async getOrders(req, res) {
    try {
      const { customerId, limit = 5, currentPage = 1 } = req.query;
      if (currentPage < 1 || limit <= 0) {
        return res
          .status(400)
          .json({ message: "current page and limit number invalid" });
      }
      const start = (currentPage - 1) * limit;
      if (!customerId) {
        return res.status(400).json({
          message: "user id khong hop le",
        });
      }
      const data = await Order.find({ customerId })
        .skip(start)
        .limit(limit)
        .populate("productId productAttribute");
      return res.status(200).json({
        success: true,
        message: "Lay du lieu thanh cong",
        data,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  async getOrder(req, res) {
    try {
      const { orderId } = req.query;
      if (!orderId) {
        return res.status(400).json({
          message: "order id khong hop le",
        });
      }
      const data = await Order.findById(orderId).populate(
        "productId productAttribute"
      );
      return res.status(200).json({
        success: true,
        message: "Lay du lieu thanh cong",
        data,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async cancelOrder(req, res) {
    try {
      const { orderId, productAttributeId } = req.query;
      if (!orderId || !productAttributeId) {
        return res.status(400).json({ message: "thong tin khong hop le" });
      }
      const deleteOrder = Order.deleteById(orderId);
      const { amount, productId } = await Order.findById(orderId).populate(
        "productId"
      );
      const updateCategory = category.updateOne(
        { _id: productId?.category },
        { $inc: { quantity: amount } }
      );
      const updateProductAttribute = ProductAttribute.updateOne(
        { _id: productAttributeId },
        { $inc: { quantity: amount } },
        { new: true }
      );
      const [data, update, categoryQuantity] = await Promise.all([
        deleteOrder,
        updateProductAttribute,
        updateCategory,
      ]);
      if (data.modifiedCount && update.modifiedCount)
        return res.status(200).json({
          success: true,
          message: "Xu ly thanh cong",
          data,
          update,
        });
      return res.status(400).json({ success: "xu ly that bai" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new OrderController();
