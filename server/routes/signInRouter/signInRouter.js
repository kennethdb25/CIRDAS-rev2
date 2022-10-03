const express = require("express");
const router = new express.Router();
const policeUser = require("../../models/policeSchema");
const adminUser = require("../../models/adminSchema");
const citizenUser = require("../../models/citizenSchema");
const bcrypt = require("bcryptjs");
const [authenticateCitizen, authenticatePolice, authenticateAdmin] = require("../../middleware/authenticate");

//for citizen user login
router.post("/citizen/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(422).json({ error: "Fill all the details" });
	}

	try {
		const userValid = await citizenUser.findOne({ email: email });

		if (userValid) {
			const isMatch = await bcrypt.compare(password, userValid.password);

			if (!isMatch) {
				res.status(422).json({ error: "Invalid Email or Password" });
			} else {
				// condition for user validation
				if (userValid.validuser === "false" && userValid.accountstatus === "Pending") {
					res.status(401).json({ status: 401, error: "Account is not validated, please contact the admin" });
				} else if (userValid.validuser === "false" && userValid.accountstatus === "Rejected") {
					res.status(401).json({ status: 401, error: "Account creation rejected, please contact the admin" });
				} else {
					const token = await userValid.generateAuthToken();

					// cookiegenerate
					res.cookie("userCitizenCookie", token, {
						expires: new Date(Date.now() + 9000000),
						httpOnly: true,
					});

					const result = {
						userValid,
						token,
					};

					res.status(201).json({ status: 201, result });
				}
			}
		} else {
			res.status(422).json({ error: "Invalid Details" });
		}
	} catch (error) {
		console.log(error);
		res.status(401).json(error);
	}
});

// citizen user valid

router.get("/validcitizen", authenticateCitizen, async (req, res) => {
	try {
		const validcitizen = await citizenUser.findOne({ _id: req.userId });
		res.status(201).json({ status: 201, validcitizen });
	} catch (error) {
		res.status(401).json({ status: 401, error });
	}
});

// citizenUser logout

router.get("/citizen/logout", authenticateCitizen, async (req, res) => {
	try {
		req.rootUser.tokens = req.rootUser.tokens.filter((currElem) => {
			return currElem.token !== req.token;
		});

		res.clearCookie("userCitizenCookie", { path: "/" });

		req.rootUser.save();

		res.status(201).json({ status: 201 });
	} catch (error) {
		res.status(401).json({ status: 401, error });
	}
});

// ------------- END FOR CITIZEN ------------------

//for police user login
router.post("/police/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(422).json({ error: "Fill all the details" });
	}

	try {
		const userValid = await policeUser.findOne({ email: email });

		if (userValid) {
			const isMatch = await bcrypt.compare(password, userValid.password);

			if (!isMatch) {
				res.status(422).json({ error: "Invalid Email or Password" });
			} else {
				// token generate
				const token = await userValid.generateAuthToken();

				// cookiegenerate
				res.cookie("usercookie", token, {
					expires: new Date(Date.now() + 9000000),
					httpOnly: true,
				});

				const result = {
					userValid,
					token,
				};

				res.status(201).json({ status: 201, result });
			}
		}
	} catch (error) {
		res.status(401).json(error);
	}
});

// police user valid

router.get("/validpolice", authenticatePolice, async (req, res) => {
	try {
		const validpolice = await policeUser.findOne({ _id: req.userId });
		res.status(201).json({ status: 201, validpolice });
	} catch (error) {
		res.status(401).json({ status: 401, error });
	}
});

// policeUser logout

router.get("/police/logout", authenticatePolice, async (req, res) => {
	try {
		req.rootUser.tokens = req.rootUser.tokens.filter((currElem) => {
			return currElem.token !== req.token;
		});

		res.clearCookie("usercookie", { path: "/" });

		req.rootUser.save();

		res.status(201).json({ status: 201 });
	} catch (error) {
		res.status(401).json({ status: 401, error });
	}
});

// ------------- END FOR POLICE ------------------

//for admin user login
router.post("/admin/login", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(422).json({ error: "Fill all the details" });
	}

	try {
		const userValid = await adminUser.findOne({ email: email });

		if (userValid) {
			const isMatch = await bcrypt.compare(password, userValid.password);

			if (!isMatch) {
				res.status(422).json({ error: "Invalid Email or Password" });
			} else {
				// token generate
				const token = await userValid.generateAuthToken();

				// cookiegenerate
				res.cookie("userAdmincookie", token, {
					expires: new Date(Date.now() + 9000000),
					httpOnly: true,
				});

				const result = {
					userValid,
					token,
				};

				res.status(201).json({ status: 201, result });
			}
		}
	} catch (error) {
		res.status(401).json(error);
	}
});

// admin user valid

router.get("/validadmin", authenticateAdmin, async (req, res) => {
	try {
		const validadmin = await adminUser.findOne({ _id: req.userId });
		res.status(201).json({ status: 201, validadmin });
	} catch (error) {
		res.status(401).json({ status: 401, error });
	}
});

// adminUser logout

router.get("/admin/logout", authenticateAdmin, async (req, res) => {
	try {
		req.rootUser.tokens = req.rootUser.tokens.filter((currElem) => {
			return currElem.token !== req.token;
		});

		res.clearCookie("userAdmincookie", { path: "/" });

		req.rootUser.save();

		res.status(201).json({ status: 201 });
	} catch (error) {
		res.status(401).json({ status: 401, error });
	}
});

module.exports = router;
