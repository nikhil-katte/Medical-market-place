const User = require("../models/User");
const { Order } = require("../models/Order");

exports.getUserById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found in DB",
			});
		}
		req.profile = user;
		next();
	});
};

exports.getUser = (req, res) => {
	req.profile.salt = undefined;
	req.profile.encry_password = undefined;
	req.profile.createdAt = undefined;
	req.profile.updatedAt = undefined;
	return res.json(req.profile);
};

exports.updateUser = (req, res) => {
	User.findByIdAndUpdate(
		{ _id: req.profile._id },
		{ $set: req.body },
		{ new: true, useFindAndModify: false },
		(err, user) => {
			if (err) {
				return res.status(400).json({
					error: "You are not authorized for this action",
				});
			}
			user.salt = undefined;
			user.encry_password = undefined;
			user.createdAt = undefined;
			user.updatedAt = undefined;
			res.json(user);
		}
	);
};

exports.userPurchaseList = (req, res) => {
	Order.find({ user: req.profile._id })
		.populate("user", "_id name")
		.sort([["createdAt", "desc"]])
		.exec((err, order) => {
			if (err) {
				return res.status(400).json({
					error: "No order in this account",
				});
			}
			res.json(order);
		});
};

exports.getAllUsers = (req, res) => {
	User.find({}).exec((err, users) => {
		if (err || !users) {
			return res.status(400).json({
				error: "Users not found in DB",
			});
		}
		return res.json(users);
	});
};
