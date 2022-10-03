const jwt = require("jsonwebtoken");
const policeUser = require("../models/policeSchema");
const adminUser = require("../models/adminSchema");
const citizenUser = require("../models/citizenSchema");
const keys = require("../config/keys");

const authenticateCitizen = async (req, res, next) => {
	try {
		const token = req.headers.authorization;

		const verifyToken = jwt.verify(token, keys.cookieKeyCitizen);

		const rootUser = await citizenUser.findOne({ _id: verifyToken._id });

		if (!rootUser) {
			throw new Error("User Not Found");
		}

		req.token = token;
		req.rootUser = rootUser;
		req.userId = rootUser._id;

		next();
	} catch (error) {
		res.status(401).json({ status: 401, message: "Unauthorized User, no token provided." });
	}
};

const authenticatePolice = async (req, res, next) => {
	try {
		const token = req.headers.authorization;

		const verifyToken = jwt.verify(token, keys.cookieKeyPolice);

		const rootUser = await policeUser.findOne({ _id: verifyToken._id });

		if (!rootUser) {
			throw new Error("User Not Found");
		}

		req.token = token;
		req.rootUser = rootUser;
		req.userId = rootUser._id;

		next();
	} catch (error) {
		res.status(401).json({ status: 401, message: "Unauthorized User, no token provided." });
	}
};

const authenticateAdmin = async (req, res, next) => {
	try {
		const token = req.headers.authorization;

		const verifyToken = jwt.verify(token, keys.cookieKeyAdmin);

		const rootUser = await adminUser.findOne({ _id: verifyToken._id });

		if (!rootUser) {
			throw new Error("User Not Found");
		}

		req.token = token;
		req.rootUser = rootUser;
		req.userId = rootUser._id;

		next();
	} catch (error) {
		res.status(401).json({ status: 401, message: "Unauthorized User, no token provided." });
	}
};

module.exports = [authenticateCitizen, authenticatePolice, authenticateAdmin];
