const express = require("express");
const policeforgot = new express.Router();
const bcrypt = require("bcryptjs");
const policeUser = require("../../../models/policeSchema");

// verify email if it is in the db
policeforgot.get("/police/forgot-password/:email", async (req, res) => {
	try {
		const getEmail = await policeUser.findOne({ email: req.params.email });
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

policeforgot.patch("/police/forgot-password/:email", async (req, res) => {
	try {
		const email = req.params.email;
		const password = await bcrypt.hash(req.body.password, 12);
		const confirmpassword = await bcrypt.hash(req.body.confirmpassword, 12);

		const getEmail = await policeUser.findOne({ email: email });

		await getEmail.updateOne({ password: password, confirmpassword: confirmpassword });

		res.status(200).json({ status: 200, body: "Updated Successfully" });
	} catch (error) {
		res.status(404).json(error);
	}
});

module.exports = policeforgot;
