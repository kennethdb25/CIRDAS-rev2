const mongoose = require("mongoose");

const wantedPersonSchema = new mongoose.Schema({
	wantedId: {
		type: String,
		required: true,
		trim: true,
	},
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
	month: {
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
	eyes: {
		type: String,
		required: true,
		trim: true,
	},
	gender: {
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
});

const wantedPerson = new mongoose.model("wantedperson", wantedPersonSchema);

module.exports = wantedPerson;
