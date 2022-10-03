const mongoose = require("mongoose");

const stationDetailsSchema = new mongoose.Schema({
	stationName: {
		type: String,
		required: true,
		trim: true,
	},
	stationAddress: {
		type: String,
		required: true,
		trim: true,
	},
	municipal: {
		type: String,
		required: true,
		trim: true,
	},
	officerInCharge: {
		type: String,
		required: true,
		trim: true,
	},
	contact: {
		type: String,
		required: true,
		trim: true,
	},
});

const stationDetails = new mongoose.model("stationdetail", stationDetailsSchema);

module.exports = stationDetails;
