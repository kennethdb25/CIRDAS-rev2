const express = require("express");
const deleteuserrouter = new express.Router();
const citizenUser = require("../../models/citizenSchema");
const policeUser = require("../../models/policeSchema");

//deleting user by updating email (sample: delete_12345678_sample@test.com)
deleteuserrouter.patch("/citizen/delete/:email", async (req, res) => {
	try {
		const email = req.params.email;

		const getEmail = await citizenUser.findOne({ email: email });

		if (!getEmail) {
			res.status(404).json({ error: "Something went wrong. Please try again later" });
		} else {
			await getEmail.updateOne({ email: `deleted_${new Date().getTime()}_${email}`, validuser: "false", accountstatus: "Deleted" });

			res.status(201).json({ status: 201, body: "Deleted Successfully" });
		}
	} catch (error) {
		res.status(422).json(error);
	}
});

// police delete account
deleteuserrouter.patch("/police/delete/:email", async (req, res) => {
	try {
		const email = req.params.email;

		const getEmail = await policeUser.findOne({ email: email });

		if (!getEmail) {
			res.status(404).json({ error: "Something went wrong. Please try again later" });
		} else {
			await getEmail.updateOne({ email: `deleted_${new Date().getTime()}_${email}` });

			res.status(201).json({ status: 201, body: "Deleted Successfully" });
		}
	} catch (error) {
		res.status(422).json(error);
	}
});

module.exports = deleteuserrouter;
