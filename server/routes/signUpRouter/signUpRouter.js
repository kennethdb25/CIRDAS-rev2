const express = require("express");
const router = new express.Router();
const multer = require("multer");
const policeUser = require("../../models/policeSchema");
const adminUser = require("../../models/adminSchema");
const citizenUser = require("../../models/citizenSchema");

const imgconfig = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "./uploads");
	},
	filename: (req, file, callback) => {
		callback(null, `${Date.now()}. ${file.originalname}`);
	},
});

const isImage = (req, file, callback) => {
	if (file.mimetype.startsWith("image")) {
		callback(null, true);
	} else {
		callback(new Error("Only image is allowed"));
	}
};

const upload = multer({
	storage: imgconfig,
	fileFilter: isImage,
});

// for citizen user registration

router.post("/citizen/register", upload.single("photo"), async (req, res) => {
	const { filename } = req.file;
	const { firstName, middleName, lastName, birthdate, gender, address, municipal, email, password, confirmpassword } = req.body;

	if (!firstName || !lastName || !birthdate || !gender || !filename || !address || !municipal || !email || !password || !confirmpassword) {
		res.status(422).json({ error: "Fill all the details" });
	}

	try {
		const preUser = await citizenUser.findOne({ email: email });
		if (preUser) {
			res.status(422).json({ error: "This Email is Already Exist" });
		} else if (password !== confirmpassword) {
			res.status(422).json({ error: "Password and Confirm Password Not Match" });
		} else {
			const finalUser = new citizenUser({
				firstName,
				middleName,
				lastName,
				birthdate,
				gender,
				imgpath: filename,
				year: new Date().getFullYear(),
				address,
				municipal,
				email,
				password,
				confirmpassword,
				validuser: "false",
				accountstatus: "Pending",
			});

			// hashing password

			const storeData = await finalUser.save();
			// console.log(storeData);

			res.status(201).json({ status: 201, storeData });
		}
	} catch (error) {
		res.status(422).json(error);
		console.log(error);
	}
});

// for police user registration
router.post("/police/register", async (req, res) => {
	const { rank, firstName, middleName, lastName, municipal, email, password, confirmPassword } = req.body;

	if (!rank || !firstName || !middleName || !lastName || !municipal || !email || !password || !confirmPassword) {
		res.status(422).json({ error: "Fill all the details" });
	}

	try {
		const preUser = await policeUser.findOne({ email: email });

		if (preUser) {
			res.status(422).json({ error: "This Email is Already Exist" });
		} else if (password !== confirmPassword) {
			res.status(422).json({ error: "Password and Confirm Password Not Match" });
		} else {
			const finalUser = new policeUser({
				rank,
				firstName,
				middleName,
				lastName,
				year: new Date().getFullYear(),
				municipal,
				email,
				password,
				confirmPassword,
			});

			// hashing password

			const storeData = await finalUser.save();
			// console.log(storeData);

			res.status(201).json({ status: 201, storeData });
		}
	} catch (error) {
		res.status(422).json(error);
		console.log("catch block error");
	}
});

router.post("/admin/register", async (req, res) => {
	const { typeAdmin, firstName, middleName, lastName, municipal, provincial, email, password, confirmPassword } = req.body;

	if (!typeAdmin || !firstName || !middleName || !lastName || !municipal || !provincial || !email || !password || !confirmPassword) {
		res.status(422).json({ error: "Fill all the details" });
	}

	try {
		const preUser = await adminUser.findOne({ email: email });

		if (preUser) {
			res.status(422).json({ error: "This Email is Already Exist" });
		} else if (password !== confirmPassword) {
			res.status(422).json({ error: "Password and Confirm Password Not Match" });
		} else {
			const finalUser = new adminUser({
				typeAdmin,
				firstName,
				middleName,
				lastName,
				year: new Date().getFullYear(),
				municipal,
				provincial,
				email,
				password,
				confirmPassword,
			});

			// hashing password

			const storeData = await finalUser.save();
			// console.log(storeData);

			res.status(201).json({ status: 201, storeData });
		}
	} catch (error) {
		res.status(422).json(error);
		console.log("catch block error");
	}
});

module.exports = router;
