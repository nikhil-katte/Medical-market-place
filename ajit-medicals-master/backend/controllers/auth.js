const User = require("../models/User");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
	console.log(req.body);
	const errors = validationResult(req);
	console.log(errors);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	const user = new User(req.body);
	user.save((err, user) => {
		if (err) {
			console.log(err);
			if (err.code === 11000)
				return res.status(400).json({
					error: "User already exists with this phone number!",
				});
			return res.status(400).json({
				error: "Unable to save data to DB",
			});
		}
		res.json({
			id: user._id,
			firstName: user.firstName,
			phoneNumber: user.phoneNumber,
		});
	});
};

exports.signin = (req, res) => {
	console.log(req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}
	const { phoneNumber, password } = req.body;
	User.findOne({ phoneNumber }, (err, user) => {
		console.log(err, user);
		if (err) {
			return res.status(400).json({
				error: "Error while finding user in DB...",
			});
		}
		if (!user) {
			return res.status(400).json({
				error: "User Phone Number is not registered",
			});
		}
		if (!user.authenticate(password)) {
			return res.status(400).json({
				error: "Invalid Phone Number / Password",
			});
		}

		const token = jwt.sign({ _id: user._id }, process.env.SECRET);
		res.cookie("token", token, { expire: new Date() + 9999 });
		const { _id, firstName, phoneNumber, role, address } = user;
		console.log(address);
		return res.json({
			token,
			user: { _id, firstName, phoneNumber, role, address },
		});
	});
};

exports.signout = (req, res) => {
	res.clearCookie("token");
	res.json({
		msg: "User signout successful",
	});
};

// Protected routes
exports.isSignedIn = expressJwt({
	secret: process.env.SECRET,
	userProperty: "auth",
	algorithms: ["sha1", "RS256", "HS256"],
});

// Custom middlewares
exports.isAuthenticated = (req, res, next) => {
	//   console.log("IN ISAUTHENTICATED");
	const checker = req.profile && req.auth && req.profile._id == req.auth._id;
	if (!checker) {
		return res.status(403).json({
			msg: "Access Denied",
		});
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	// console.log("In ISADMIN");
	if (!req.profile.role === 0) {
		return res.status(403).json({
			msg: "You are not Admin, access denied",
		});
	}
	next();
};
