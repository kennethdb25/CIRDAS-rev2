const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const policeSchema = new mongoose.Schema({
	policeId: {
		type: String,
		required: true,
		trim: true,
	},
	rank: {
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
	address: {
		type: String,
		required: true,
		trim: true,
	},
	birthdate: {
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
	confirmpassword: {
		type: String,
		required: true,
		minLength: 8,
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

// hashing password
policeSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 12);
		this.confirmpassword = await bcrypt.hash(this.confirmpassword, 12);
	}
	next();
});

policeSchema.methods.generateAuthToken = async function () {
	try {
		let token23 = jwt.sign({ _id: this._id }, keys.cookieKeyPolice, { expiresIn: "1d" });

		this.tokens = this.tokens.concat({ token: token23 });
		await this.save();
		return token23;
	} catch (error) {
		res.status(422).json(error);
	}
};

const policeUser = new mongoose.model("policeuser", policeSchema);

module.exports = policeUser;
