const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	complaintid: {
		type: String,
		required: true,
	},
	complainantname: {
		type: String,
		required: true,
	},
	complaint: {
		type: String,
		required: false,
		trim: true,
	},
	contact: {
		type: String,
		required: true,
		trim: true,
	},
	municipal: {
		type: String,
		required: false,
		trim: true,
	},
	address: {
		type: String,
		required: false,
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
	victim: {
		type: String,
		required: false,
		trim: true,
	},
	witness: {
		type: String,
		required: false,
		trim: true,
	},
	suspect: {
		type: String,
		required: false,
		trim: true,
	},
	description: {
		type: String,
		required: false,
	},
	status: {
		type: String,
		required: false,
	},
	assignment: [
		{
			assignTo: {
				type: String,
			},
		},
	],
});

const complaint = new mongoose.model("complaintItem", complaintSchema);

module.exports = complaint;
