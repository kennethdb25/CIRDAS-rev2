const express = require("express");
const complaintRouter = new express.Router();
const complaintSchema = require("../../models/complaintSchema/complaintSchema");

complaintRouter.post("/citizen/complaint", async (req, res) => {
	const { id, complainantname, complaint, contact, municipal, address, victim, witness, suspect, description, timeAndDate } = req.body;

	const complaintcount = await complaintSchema.find().count();

	if (!id || !complainantname || !complaint || !contact || !municipal || !address || !witness) {
		res.status(422).json({ error: "Fill all required details" });
	} else {
		try {
			const finalComplaint = new complaintSchema({
				id,
				complaintid: `COMP-${complaintcount + 1}`,
				complainantname,
				complaint,
				contact,
				municipal,
				address,
				year: `${new Date().getFullYear()}`,
				timeAndDate,
				victim,
				witness,
				suspect,
				description,
				status: "Pending",
			});

			const storeData = await finalComplaint.save();

			res.status(201).json({ status: 201, storeData });
		} catch (error) {
			res.status(422).json(error);
			console.log("catch block error");
		}
	}
});

complaintRouter.get("/citizen/complaint", async (req, res) => {
	try {
		const complaint = await complaintSchema.find();
		res.status(200).json({ status: 200, body: complaint });
	} catch (error) {
		res.status(404).json(error);
	}
});

// findComplaint by the ID of the user who made the complaint

complaintRouter.get("/citizen/complaint/:id", async (req, res) => {
	try {
		const getComplaintById = await complaintSchema.find({ id: req.params.id });
		res.status(200).json({ status: 200, body: getComplaintById });
	} catch (error) {
		res.status(404).json(error);
	}
});

// For Citizen - Pending
complaintRouter.get("/citizen/complaint/:status/:id", async (req, res) => {
	try {
		const getComplaintById = await complaintSchema.find({ id: req.params.id, status: "Pending" }).count();
		res.status(200).json(getComplaintById);
	} catch (error) {
		res.status(404).json(error);
	}
});
// For Police - Pending
complaintRouter.get("/citizen/complaintsss/:status", async (req, res) => {
	try {
		const getComplaintById = await complaintSchema.find({ status: "Pending" }).count();
		res.status(200).json(getComplaintById);
	} catch (error) {
		res.status(404).json(error);
	}
});

// For Citizen - Reviewed
complaintRouter.get("/citizen/complaintss/:status/:id", async (req, res) => {
	try {
		const getComplaintById = await complaintSchema.find({ id: req.params.id, status: "Reviewed" }).count();
		res.status(200).json(getComplaintById);
	} catch (error) {
		res.status(404).json(error);
	}
});

// For Police - Reviewed
complaintRouter.get("/citizen/complaintss/:status", async (req, res) => {
	try {
		const getComplaintById = await complaintSchema.find({ status: "Reviewed" }).count();
		res.status(200).json(getComplaintById);
	} catch (error) {
		res.status(404).json(error);
	}
});

// For Citizen - For Investigation
complaintRouter.get("/citizen/complaints/:status/:id", async (req, res) => {
	try {
		const getCountByStatus = await complaintSchema.find({ id: req.params.id, status: "ForInvestigation" }).count();
		res.status(200).json(getCountByStatus);
	} catch (error) {
		res.status(404).json(error);
	}
});

// For Police - For Investigation
complaintRouter.get("/citizen/complaints/:status", async (req, res) => {
	try {
		const getCountByStatus = await complaintSchema.find({ status: "ForInvestigation" }).count();
		res.status(200).json(getCountByStatus);
	} catch (error) {
		res.status(404).json(error);
	}
});

module.exports = complaintRouter;
