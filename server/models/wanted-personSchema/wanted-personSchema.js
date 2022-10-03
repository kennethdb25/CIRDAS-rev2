const mongoose = require("mongoose");

const wantedPersonSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	age: {
		type: Number,
		required: true,
		trim: true,
	},
	imgpath: {
		type: String,
		required: true,
	},
	cases: {
		type: String,
		required: true,
		trim: true,
	},
	address: {
		type: String,
		required: true,
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
	description: {
		type: String,
		required: true,
		trim: true,
	},
	contact: {
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

const wantedPerson = new mongoose.model("wantedperson", wantedPersonSchema);

module.exports = wantedPerson;
