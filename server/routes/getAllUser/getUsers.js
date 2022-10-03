const express = require("express");
const getUsers = express.Router();
const citizenUser = require("../../models/citizenSchema");
const policeUser = require("../../models/policeSchema");

getUsers.get("/getAll/citizen", async (req, res) => {
	try {
		const citizen = await citizenUser.find();
		res.status(200).json({ status: 201, body: citizen });
	} catch (error) {
		res.status(404).json({ error });
	}
});

getUsers.get("/getAll/police", async (req, res) => {
	try {
		const police = await policeUser.find();
		res.status(200).json({ status: 201, body: police });
	} catch (error) {
		res.status(404).json({ error });
	}
});

module.exports = getUsers;
