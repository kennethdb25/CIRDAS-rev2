const express = require("express");
const getUsers = express.Router();
const citizenUser = require("../../models/citizenSchema");
const policeUser = require("../../models/policeSchema");
const adminUser = require("../../models/adminSchema");

// get all citizen users
getUsers.get("/citizen/users", async (req, res) => {
	try {
		const citizen = await citizenUser.find();
		res.status(200).json({ status: 201, body: citizen });
	} catch (error) {
		res.status(404).json({ error });
	}
});
// validate user-citizen
getUsers.patch("/citizen/users/:email", async (req, res) => {
	try {
		const email = req.params.email;

		const getValidEmail = await citizenUser.findOne({ email: email });

		if (!getValidEmail) {
			res.status(404).json({ error: "Something went wrong. Please try again later" });
		} else {
			await getValidEmail.updateOne({ validuser: "true", accountstatus: "Validated" });

			res.status(201).json({ status: 201, body: "Validated Successfully" });
		}
	} catch (error) {
		res.status(422).json(error);
	}
});
// reject citizend user
getUsers.delete("/citizen/users/:email", async (req, res) => {
	try {
		const email = req.params.email;

		const getValidEmail = await citizenUser.findOne({ email: email });

		if (!getValidEmail) {
			res.status(404).json({ error: "Something went wrong. Please try again later" });
		} else {
			await getValidEmail.deleteOne();

			res.status(201).json({ status: 201, body: "Deleted Successfully" });
		}
	} catch (error) {
		res.status(422).json(error);
	}
});

getUsers.get("/police/users", async (req, res) => {
	try {
		const police = await policeUser.find();
		res.status(200).json({ status: 201, body: police });
	} catch (error) {
		res.status(404).json({ error });
	}
});

getUsers.get("/admin/users", async (req, res) => {
	try {
		const admin = await adminUser.find();
		res.status(200).json({ status: 201, body: admin });
	} catch (error) {
		res.status(404).json({ error });
	}
});

module.exports = getUsers;
