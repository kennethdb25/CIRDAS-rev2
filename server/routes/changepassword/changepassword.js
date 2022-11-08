const express = require("express");
const changepasswordrouter = new express.Router();
const bcrypt = require("bcryptjs");
const citizenUser = require("../../models/citizenSchema");
const policeUser = require("../../models/policeSchema");

// updating password
changepasswordrouter.patch("/citizen/change-password/:email", async (req, res) => {
	try {
		const email = req.params.email;
		const { password, confirmpassword } = req.body;

		const getEmail = await citizenUser.findOne({ email: email });

		if (!getEmail) {
			res.status(404).json({ error: "Something went wrong. Please try again later" });
		} else {
			const isMatch = await bcrypt.compare(password, getEmail.password);
			if (!isMatch) {
				await getEmail.updateOne({ password: password, confirmpassword: confirmpassword });
				res.status(201).json({ status: 201, body: "Updated Successfully" });
			} else {
				res.status(401).json({ error: "Password cannot be the same with your previous password" });
			}
		}
	} catch (error) {
		res.status(422).json(error);
	}
});

changepasswordrouter.patch("/police/change-password/:email", async (req, res) => {
	try {
		const email = req.params.email;
		const { password, confirmpassword } = req.body;

		const getPoliceEmail = await policeUser.findOne({ email: email });

		if (!getPoliceEmail) {
			res.status(404).json({ error: "Something went wrong. Please try again later" });
		} else {
			const isMatch = await bcrypt.compare(password, getPoliceEmail.password);
			if (!isMatch) {
				await getPoliceEmail.updateOne({ password: password, confirmpassword: confirmpassword });
				res.status(201).json({ status: 201, body: "Updated Successfully" });
			} else {
				res.status(401).json({ error: "Password cannot be the same with your previous password" });
			}
		}
	} catch (error) {
		console.log(error);
		res.status(422).json(error);
	}
});

module.exports = changepasswordrouter;
