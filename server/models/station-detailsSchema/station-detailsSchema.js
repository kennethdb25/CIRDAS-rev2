const mongoose = require("mongoose");

const stationDetailsSchema = new mongoose.Schema({
	stationdId: {
		type: String,
		required: true,
		trim: true,
	},
	latdec: {
		type: String,
		required: true,
		trim: true,
	},
	londec: {
		type: String,
		required: true,
		trim: true,
	},
	Municipal: {
		type: String,
		required: true,
		trim: true,
	},
	details: {
		type: String,
		required: true,
		trim: true,
	},
	MunicipalOIC: {
		type: String,
		required: true,
		trim: true,
	},
	contactnumber: {
		type: String,
		required: true,
		trim: true,
	},
});

const stationDetails = new mongoose.model("stationdetail", stationDetailsSchema);

module.exports = stationDetails;
