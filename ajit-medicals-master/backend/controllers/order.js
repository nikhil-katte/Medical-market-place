const { Order, ProductCart } = require("../models/Order");
const User = require("../models/User");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .populate("user", "_id firstName lastName phoneNumber")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "Order not found in DB",
        });
      }
      req.order = order;
      next();
    });
};

exports.getOnlyOrderById = (req, res) => {
  res.json(req.order);
};

exports.createOrder = (req, res) => {
  let { cartData, cartTotal, address } = req.body;
  let data = {
    products: cartData,
    amount: cartTotal,
    user: req.profile._id,
    address,
    updated: Date.now(),
  };
  console.log("CART DATA: ", data);

  const order = new Order(data);
  order.save((err, resData) => {
    if (err || !resData) {
      return res.status(400).json({
        error: "Unable to create Order in DB",
      });
    }
    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { orders: resData.id }, address: address }
    )
      .then((data) => console.log("Added in user's orders"))
      .catch((err) => {
        res.status(400).json({ error: "Unable to save in user's order" });
      });
    res.json(resData);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id firstName lastName phoneNumber")
	.sort([["createdAt", "desc"]])
    .exec((err, orders) => {
      if (err || !orders) {
        return res.status(400).json({
          error: "No order found in DB",
        });
      }
      res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.updateOne(
    { _id: req.order._id },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to update status in DB",
        });
      }
      res.json(order);
    }
  );
};

exports.getOrderByUserId = (req, res) => {
  user = req.profile;
  Order.find({ user: user._id })
  .exec((err, orders) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to fetch your orders",
      });
    }
    res.json(orders);
  });
};
