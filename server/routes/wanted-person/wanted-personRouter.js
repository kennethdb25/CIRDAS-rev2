const express = require("express");
const wantedpersonRouter = new express.Router();
const multer = require("multer");
const wantedPersonSchema = require("../../models/wanted-personSchema/wanted-personSchema");

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

wantedpersonRouter.post("/wanted-person", upload.single("photo"), async (req, res) => {
	const { filename } = req.file;
	const { name, age, cases, address, municipal, description, contact, eyes, gender, hair, height } = req.body;

	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const wantedpersoncount = await wantedPersonSchema.find().count();

	try {
		const finalWantedPerson = new wantedPersonSchema({
			wantedId: `WP-${wantedpersoncount + 1}`,
			name,
			age,
			imgpath: filename,
			cases,
			address,
			year: `${new Date().getFullYear()}`,
			month: months[new Date().getMonth() + 1],
			timeAndDate: `${new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()}`,
			municipal,
			eyes,
			gender,
			hair,
			height,
			description,
			contact,
			status: "Wanted",
		});

		const storeData = await finalWantedPerson.save();

		res.status(201).json({ status: 201, storeData });
	} catch (error) {
		console.log(error);
		res.status(422).json(error);
		console.log("catch block error");
	}
});

wantedpersonRouter.patch("/admin/wanted-person/:_id", async (req, res) => {
	try {
		const id = req.params._id;
		const { status } = req.body;

		const getWantedPerson = await wantedPersonSchema.findOne({ _id: id });

		if (!getWantedPerson) {
			res.status(422).json({ error: `No wanted person match with ${id}` });
		} else {
			if (status) getWantedPerson.status = status;

			const updatedData = await getWantedPerson.save();

			res.status(201).json({ status: 201, updatedData });
		}
	} catch (error) {
		console.log(error);
		res.status(404).json(error);
	}
});

wantedpersonRouter.patch("/wanted-person/update/:wantedId", upload.single("photo"), async (req, res) => {
	try {
		const wantedpersonId = req.params.wantedId;
		const { name, age, cases, address, municipal, description, contact, eyes, gender, hair, height } = req.body;

		const getWantedPerson = await wantedPersonSchema.findOne({ wantedId: wantedpersonId });

		if (!getWantedPerson) {
			res.status(422).json({ error: `No missing person match with ${getWantedPerson}` });
		} else {
			if (name) getWantedPerson.name = name;
			if (cases) getWantedPerson.cases = cases;
			if (age) getWantedPerson.age = age;
			if (gender) getWantedPerson.gender = gender;
			if (eyes) getWantedPerson.eyes = eyes;
			if (hair) getWantedPerson.hair = hair;
			if (height) getWantedPerson.height = height;
			if (address) getWantedPerson.address = address;
			if (municipal) getWantedPerson.municipal = municipal;
			if (contact) getWantedPerson.contact = contact;
			if (description) getWantedPerson.description = description;

			const updatedData = await getWantedPerson.save();

			res.status(201).json({ status: 201, updatedData });
		}
	} catch (error) {}
});

// get all wanted person
wantedpersonRouter.get("/wanted-person", async (req, res) => {
	try {
		const wantedPerson = await wantedPersonSchema.find();
		res.status(200).json({ status: 200, body: wantedPerson });
	} catch (error) {
		res.status(404).json(error);
	}
});

// get all wanted person by status - wanted
wantedpersonRouter.get("/wanted-person/status", async (req, res) => {
	try {
		const wantedPerson = await wantedPersonSchema.find({ status: "Wanted" });
		res.status(200).json({ status: 200, body: wantedPerson });
	} catch (error) {
		res.status(404).json(error);
	}
});

// get all wanted person count by municipality
wantedpersonRouter.get("/wanted-person/count/:municipal", async (req, res) => {
	try {
		const getWantedCount = await wantedPersonSchema.find({ municipal: req.params.municipal }).count();
		res.status(200).json({ status: 200, getWantedCount });
	} catch (error) {
		res.status(404).json(error);
	}
});

module.exports = wantedpersonRouter;
