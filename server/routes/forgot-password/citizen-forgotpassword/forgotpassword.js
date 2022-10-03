const express = require("express");
const forgotrouter = new express.Router();
const bcrypt = require("bcryptjs");
const citizenUser = require("../../../models/citizenSchema");

// verify email if it is in the db
forgotrouter.get("/citizen/forgot-password/:email", async (req, res) => {
	try {
		const getEmail = await citizenUser.findOne({ email: req.params.email });
		if (getEmail) {
			res.status(200).json({ status: 200, body: "Valid Email" });
		} else {
			res.status(422).json({ status: 422, body: "Email doesn't match" });
		}
	} catch (error) {
		res.status(404).json(error);
	}
});

// updating password by email

forgotrouter.patch("/citizen/forgot-password/:email", async (req, res) => {
	try {
		const email = req.params.email;
		const password = await bcrypt.hash(req.body.password, 12);
		const confirmpassword = await bcrypt.hash(req.body.confirmpassword, 12);

		const getEmail = await citizenUser.findOne({ email: email });

		await getEmail.updateOne({ password: password, confirmpassword: confirmpassword });

		res.status(200).json({ status: 200, body: "Updated Successfully" });
	} catch (error) {
		res.status(404).json(error);
	}
});

module.exports = forgotrouter;
