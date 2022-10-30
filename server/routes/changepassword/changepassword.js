const express = require("express");
const changepasswordrouter = new express.Router();
const bcrypt = require("bcryptjs");
const citizenUser = require("../../models/citizenSchema");

// updating password
changepasswordrouter.patch("/citizen/change-password/:email", async (req, res) => {
	try {
		const email = req.params.email;
		const password = await bcrypt.hash(req.body.password, 12);
		const confirmpassword = await bcrypt.hash(req.body.confirmpassword, 12);

		const getEmail = await citizenUser.findOne({ email: email });

		if (!getEmail) {
			res.status(404).json({ error: "Something went wrong. Please try again later" });
		} else {
			const isMatch = await bcrypt.compare(password, getEmail.password);
			if (req.body.password != getEmail.password) {
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

module.exports = changepasswordrouter;
