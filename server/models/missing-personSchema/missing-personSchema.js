const mongoose = require("mongoose");

const missingPersonSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		trim: true,
	},
	missingpersonid: {
		type: String,
		required: true,
	},
	contactperson: {
		type: String,
		required: true,
		trim: true,
	},
	fullname: {
		type: String,
		required: true,
		trim: true,
	},
	dob: {
		type: String,
		required: true,
		trim: true,
	},
	age: {
		type: String,
		required: true,
		trim: true,
	},
	gender: {
		type: String,
		required: true,
		trim: true,
	},
	race: {
		type: String,
		required: true,
		trim: true,
	},
	eyes: {
		type: String,
		required: true,
		trim: true,
	},
	hair: {
		type: String,
		required: true,
		trim: true,
	},
	height: {
		type: String,
		required: true,
		trim: true,
	},
	weight: {
		type: String,
		required: true,
		trim: true,
	},
	wearing: {
		type: String,
		required: true,
		trim: true,
	},
	imgpath: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
		trim: true,
	},
	month: {
		type: String,
		required: false,
		trim: true,
	},
	year: {
		type: String,
		required: false,
		trim: true,
	},
	timeAndDate: {
		type: String,
		required: false,
	},
	municipal: {
		type: String,
		required: true,
		trim: true,
	},
	characteristics: {
		type: String,
		required: true,
		trim: true,
	},
	contact: {
		type: String,
		required: true,
		trim: true,
	},
	relation: {
		type: String,
		required: true,
		trim: true,
	},
	lastlocation: {
		type: String,
		required: true,
		trim: true,
	},
	lastseen: {
		type: String,
		required: true,
		trim: true,
	},
	status: {
		type: String,
		required: true,
		trim: true,
	},
});

const missingPerson = new mongoose.model("missingperson", missingPersonSchema);

module.exports = missingPerson;
