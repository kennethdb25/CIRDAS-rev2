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

	const citizenUserCount = await citizenUser.find().count();

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
				citizenId: `CTZ-${citizenUserCount + 1}`,
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

			res.status(201).json({ status: 201, storeData });
		}
	} catch (error) {
		res.status(422).json(error);
		console.log(error);
	}
});

// for police user registration
router.post("/police/register", async (req, res) => {
	const { rank, firstName, middleName, lastName, municipal, email, password, confirmpassword, address, birthdate, gender } = req.body;

	const policeUserCount = await policeUser.find().count();

	if (!rank || !firstName || !lastName || !birthdate || !address || !gender || !municipal || !email || !password || !confirmpassword) {
		res.status(422).json({ error: "Fill all the details" });
	}

	try {
		const preUser = await policeUser.findOne({ email: email });

		if (preUser) {
			res.status(422).json({ error: "This Email is Already Exist" });
		} else if (password !== confirmpassword) {
			res.status(422).json({ error: "Password and Confirm Password Not Match" });
		} else {
			const finalUser = new policeUser({
				policeId: `POL-${policeUserCount + 1}`,
				rank,
				firstName,
				middleName,
				lastName,
				address,
				birthdate,
				gender,
				year: new Date().getFullYear(),
				municipal,
				email,
				password,
				confirmpassword,
			});

			// hashing password

			const storeData = await finalUser.save();

			res.status(201).json({ status: 201, storeData });
		}
	} catch (error) {
		console.log(error);
		res.status(422).json(error);
		console.log("catch block error");
	}
});

router.post("/admin/register", async (req, res) => {
	const { typeAdmin, firstName, middleName, lastName, municipal, provincial, email, password, confirmPassword } = req.body;

	if (!typeAdmin || !firstName || !middleName || !lastName || !municipal || !provincial || !email || !password || !confirmPassword) {
		res.status(422).json({ error: "Fill all the details" });
	}

	const getAdminCount = await adminUser.find().count();

	try {
		const preUser = await adminUser.findOne({ email: email });

		if (preUser) {
			res.status(422).json({ error: "This Email is Already Exist" });
		} else if (password !== confirmPassword) {
			res.status(422).json({ error: "Password and Confirm Password Not Match" });
		} else {
			const finalUser = new adminUser({
				adminId: `ADMIN-${getAdminCount + 1}`,
				firstName,
				middleName,
				lastName,
				dob,
				gender,
				year: new Date().getFullYear(),
				municipal,
				address,
				role,
				validuser: "true",
				email,
				password,
				confirmPassword,
			});

			// hashing password

			const storeData = await finalUser.save();

			res.status(201).json({ status: 201, storeData });
		}
	} catch (error) {
		res.status(422).json(error);
		console.log("catch block error");
	}
});

router.patch("/citizen/update/:citizenId", async (req, res) => {
	try {
		const citizenId = req.params.citizenId;
		const { email, address, municipal } = req.body;

		const getCitizenUser = await citizenUser.findOne({ citizenId: citizenId });

		if (!getCitizenUser) {
			res.status(422).json({ error: `No user match with ${citizenId}` });
		} else if (email === getCitizenUser?.email && address === getCitizenUser?.address && municipal === getCitizenUser?.municipal) {
			res.status(422).json({ error: "No changes have been made!" });
		} else {
			if (email) getCitizenUser.email = email;
			if (address) getCitizenUser.address = address;
			if (municipal) getCitizenUser.municipal = municipal;

			const updatedData = await getCitizenUser.save();

			res.status(201).json({ status: 201, updatedData });
		}
	} catch (error) {
		res.status(404).json(error);
	}
});

router.patch("/police/update/:policeId", async (req, res) => {
	try {
		const policeId = req.params.policeId;
		const { email, address, municipal, rank } = req.body;

		const getPoliceUser = await policeUser.findOne({ policeId: policeId });

		if (!getPoliceUser) {
			res.status(422).json({ error: `No user match with ${citizenId}` });
		} else if (
			email === getPoliceUser?.email &&
			address === getPoliceUser?.address &&
			municipal === getPoliceUser?.municipal &&
			rank === getPoliceUser?.rank
		) {
			res.status(422).json({ error: "No changes have been made!" });
		} else {
			if (email) getPoliceUser.email = email;
			if (address) getPoliceUser.address = address;
			if (municipal) getPoliceUser.municipal = municipal;
			if (rank) getPoliceUser.rank = rank;

			const updatedData = await getPoliceUser.save();

			res.status(201).json({ status: 201, updatedData });
		}
	} catch (error) {
		res.status(404).json(error);
	}
});

module.exports = router;
