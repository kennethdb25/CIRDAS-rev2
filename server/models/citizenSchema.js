const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const userSchema = new mongoose.Schema({
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
	birthdate: {
		type: String,
		required: true,
		trim: true,
	},
	imgpath: {
		type: String,
		required: true,
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
	address: {
		type: String,
		required: true,
		trim: true,
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

// hashing password
userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 12);
		this.confirmpassword = await bcrypt.hash(this.confirmpassword, 12);
	}
	next();
});

userSchema.methods.generateAuthToken = async function () {
	try {
		let token25 = jwt.sign({ _id: this._id }, keys.cookieKeyCitizen, { expiresIn: "1d" });

		this.tokens = this.tokens.concat({ token: token25 });
		await this.save();
		return token25;
	} catch (error) {
		console.log(error);
	}
};

const citizenUser = new mongoose.model("citizenuser", userSchema);

module.exports = citizenUser;
