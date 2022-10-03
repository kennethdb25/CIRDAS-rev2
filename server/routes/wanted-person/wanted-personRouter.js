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
	const { name, age, cases, address, year, municipal, description, contact, status } = req.body;

	if (!name || !age || !cases || !address || !year || !municipal || !description || !contact || !status || !filename) {
		res.status(422).json({ error: "Fill all required details" });
	} else {
		try {
			const finalWantedPerson = new wantedPersonSchema({
				name,
				age,
				imgpath: filename,
				cases,
				address,
				year,
				timeAndDate: `${new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()}`,
				municipal,
				description,
				contact,
				status: "Wanted",
			});

			const storeData = await finalWantedPerson.save();

			res.status(201).json({ status: 201, storeData });
		} catch (error) {
			res.status(422).json(error);
			console.log("catch block error");
		}
	}
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
