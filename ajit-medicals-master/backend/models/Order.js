const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
  _id: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
  company: String,
  category: {
    type: ObjectId,
    ref: "Category",
  },
});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

const orderSchema = new mongoose.Schema(
  {
    products: [ProductCartSchema],
    amount: Number,
    address: String,
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Cancelled", "Delivering", "Completed"],
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart };
