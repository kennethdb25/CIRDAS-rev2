const express = require("express");
const complaintRouter = new express.Router();
const complaintSchema = require("../../models/complaintSchema/complaintSchema");

complaintRouter.post("/citizen/complaint", async (req, res) => {
	const { userId, complainantname, complaint, contact, municipal, address, victim, witness, suspect, description, timeAndDate } = req.body;

	const complaintcount = await complaintSchema.find().count();

	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	if (!userId || !complainantname || !complaint || !contact || !municipal || !address || !witness) {
		res.status(422).json({ error: "Fill all required details" });
	} else {
		try {
			const finalComplaint = new complaintSchema({
				userId,
				complaintid: `COMP-${complaintcount + 1}`,
				complainantname,
				complaint,
				contact,
				municipal,
				address,
				year: `${new Date().getFullYear()}`,
				month: months[new Date().getMonth() + 1],
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

// updating complaint
complaintRouter.patch("/citizen/complaint/:complaintid", async (req, res) => {
	try {
		const complaintid = req.params.complaintid;
		const { userId, complaint, contact, municipal, address, victim, witness, suspect, description } = req.body;

		const getcomplaint = await complaintSchema.findOne({ complaintid: complaintid });

		if (!getcomplaint) {
			res.status(422).json({ error: `No complaint match with ${complaintid}` });
		} else {
			if (userId) getcomplaint.userId = userId;
			if (complaint) getcomplaint.complaint = complaint;
			if (contact) getcomplaint.contact = contact;
			if (municipal) getcomplaint.municipal = municipal;
			if (address) getcomplaint.address = address;
			if (victim) getcomplaint.victim = victim;
			if (witness) getcomplaint.witness = witness;
			if (suspect) getcomplaint.suspect = suspect;
			if (description) getcomplaint.description = description;

			const updatedData = await getcomplaint.save();

			res.status(201).json({ status: 201, updatedData });
		}
	} catch (error) {
		res.status(404).json(error);
	}
});

complaintRouter.get("/citizen/complaint", async (req, res) => {
	try {
		const complaint = await complaintSchema.find().sort({ timeAndDate: -1 });
		res.status(200).json({ status: 200, body: complaint });
	} catch (error) {
		res.status(404).json(error);
	}
});

// findComplaint by the ID of the user who made the complaint

complaintRouter.get("/citizen/complaint/:id", async (req, res) => {
	try {
		const getComplaintById = await complaintSchema.find({ userId: req.params.id });
		res.status(200).json({ status: 200, body: getComplaintById });
	} catch (error) {
		res.status(404).json(error);
	}
});

// For Citizen - Pending
complaintRouter.get("/citizen/complaint/:status/:userId", async (req, res) => {
	try {
		const getComplaintById = await complaintSchema.find({ userId: req.params.userId, status: "Pending" }).count();
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
	// kuys try to create a condtion for this API (if req.params.status === Reviewed)
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
		const getCountByStatus = await complaintSchema.find({ id: req.params.id, status: "UnderInvestigation" }).count();
		res.status(200).json(getCountByStatus);
	} catch (error) {
		res.status(404).json(error);
	}
});

// For Police - For Investigation
complaintRouter.get("/citizen/complaints/:status", async (req, res) => {
	try {
		const getCountByStatus = await complaintSchema.find({ status: "UnderInvestigation" }).count();
		res.status(200).json(getCountByStatus);
	} catch (error) {
		res.status(404).json(error);
	}
});

// end of condition

module.exports = complaintRouter;
