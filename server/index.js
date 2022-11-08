const express = require("express");
require("./db/conn");
require("dotenv").config();
const path = require("path");
const complaintRouter = require("./routes/complaints/complaintsRouter");
const signupRouter = require("./routes/signUpRouter/signUpRouter");
const router = require("./routes/signInRouter/signInRouter");
const routeCitizen = require("./routes/getAllUser/getUsers");
const routerMissingPerson = require("./routes/missing-person/missing-personRouter");
const routerStationDetails = require("./routes/station-details/station-detailsRouter");
const routerWantedPerson = require("./routes/wanted-person/wanted-personRouter");
const getUsers = require("./routes/getAllUser/getUsers");
const forgotrouter = require("./routes/forgot-password/citizen-forgotpassword/forgotpassword");
const policeforgot = require("./routes/forgot-password/police-forgotpassword/forgotpassword");
const adminforgot = require("./routes/forgot-password/admin-forgotpassword/forgotpassword");
const changepasswordrouter = require("./routes/changepassword/changepassword");
const deleteuserrouter = require("./routes/deleteuser/deleteuser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(routeCitizen);
app.use(signupRouter);
app.use(router);
app.use(complaintRouter);
app.use(routerMissingPerson);
app.use(routerStationDetails);
app.use(routerWantedPerson);
app.use(getUsers);
app.use(forgotrouter);
app.use(policeforgot);
app.use(adminforgot);
app.use(changepasswordrouter);
app.use(deleteuserrouter);

app.use("/uploads", express.static("./uploads"));

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "client/build")));

	app.get("*", function (req, res) {
		res.sendFile(path.join(__dirname, "client/build", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server is running at port: ${PORT}`);
});
