const express = require("express");
const stationDetailsRouter = new express.Router();
const stationDetailsSchema = require("../../models/station-detailsSchema/station-detailsSchema");

stationDetailsRouter.post("/station-details", async (req, res) => {
	const { stationName, stationAddress, municipal, officerInCharge, contact } = req.body;

	if (!stationName || !stationAddress || !municipal || !officerInCharge || !contact) {
		res.status(422).json({ error: "Fill all required details" });
	} else {
		try {
			const finalStationDetails = new stationDetailsSchema({ stationName, stationAddress, municipal, officerInCharge, contact });

			const storeData = await finalStationDetails.save();

			res.status(201).json({ status: 201, storeData });
		} catch (error) {
			res.status(422).json(error);
			console.log("catch block error");
		}
	}
});

stationDetailsRouter.get("/station-details", async (req, res) => {
	try {
		const stationDetails = await stationDetailsSchema.find();
		res.status(200).json({ status: 200, body: stationDetails });
	} catch (error) {
		res.status(404).json(error);
	}
});

module.exports = stationDetailsRouter;
