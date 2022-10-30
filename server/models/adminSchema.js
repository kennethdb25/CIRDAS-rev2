const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const adminSchema = mongoose.Schema({
	typeAdmin: {
		type: String,
		required: true,
		trim: true,
	},
	firstName: {
		type: String,
		required: true,
		trim: true,
	},
	middleName: {
		type: String,
		required: false,
		trim: true,
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
	},
	dob: {
		type: String,
		required: true,
		trim: true,
	},
	gender: {
		type: String,
		required: true,
		trim: true,
	},
	year: {
		type: String,
		required: true,
	},
	municipal: {
		type: String,
		required: true,
		trim: true,
	},
	address: {
		type: String,
		required: true,
		trim: true,
	},
	role: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validator(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Not Valid Email");
			}
		},
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
	},
	confirmPassword: {
		type: String,
		required: true,
		minLength: 8,
	},
	validuser: {
		type: String,
		required: true,
	},
	accountstatus: {
		type: String,
		required: true,
		trim: true,
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

//hashing password

adminSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 12);
		this.confirmPassword = await bcrypt.hash(this.confirmPassword, 12);
	}
	next();
});

adminSchema.methods.generateAuthToken = async function () {
	try {
		let token22 = jwt.sign({ _id: this._id }, keys.cookieKeyAdmin, {
			expiresIn: "1d",
		});

		this.tokens = this.tokens.concat({ token: token22 });
		await this.save();
		return token22;
	} catch (error) {
		res.status(422).json(error);
	}
};

const adminUser = new mongoose.model("admineuser", adminSchema);

module.exports = adminUser;
