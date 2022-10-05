import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { LoginContext } from "./context/Context";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import PATH from "./path/Path";
import {
	AdminDashboardContent,
	AdminLogin,
	CitizenDashboardContent,
	CitizenForgotPassword,
	CitizenLogin,
	NotFoundContent,
	PoliceDashboardContent,
	PoliceForgotPassword,
	PoliceLogin,
} from "./pages/Pages";

function App() {
	const [data, setData] = useState("");
	// eslint-disable-next-line no-unused-vars
	const { loginData, setLoginData } = useContext(LoginContext);
	const history = useNavigate();

	const DasboardValid = async () => {
		if (localStorage.getItem("policeUserDataToken")) {
			let validToken = localStorage.getItem("policeUserDataToken");
			const res = await fetch("/validpolice", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": validToken,
				},
			});

			const fetchedData = await res.json();

			if (fetchedData.status === 401 || !fetchedData) {
				console.log("user not valid");
			} else {
				console.log("user verified");
				setLoginData(fetchedData);
				history("/user-police/dashboard");
			}
		} else if (localStorage.getItem("adminUserDataToken")) {
			let validToken = localStorage.getItem("adminUserDataToken");
			const res = await fetch("/validAdminser", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": validToken,
				},
			});

			const fetchedData = await res.json();

			if (fetchedData.status === 401 || !fetchedData) {
				console.log("user not valid");
			} else {
				console.log("user verified");
				setLoginData(fetchedData);
				history("/user-admin/dashboard");
			}
		} else if (localStorage.getItem("citizenUserDataToken")) {
			let validToken = localStorage.getItem("citizenUserDataToken");
			const res = await fetch("/validcitizen", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": validToken,
				},
			});

			const fetchedData = await res.json();

			if (data.status === 401 || !fetchedData) {
				console.log("user not valid");
			} else {
				console.log("user verified");
				setLoginData(fetchedData);
				history("/user-citizen/dashboard");
			}
		}
	};

	useEffect(() => {
		setTimeout(() => {
			DasboardValid();
			setData(true);
		}, 2000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{data ? (
				<>
					<Routes>
						<Route path={PATH.DEFAULT} element={<CitizenLogin />} />
						<Route path={PATH.POLICELOGIN} element={<PoliceLogin />} />
						<Route path={PATH.ADMINLOGIN} element={<AdminLogin />} />
						<Route path={PATH.FORGOTPASSWORD} element={<CitizenForgotPassword />} />
						<Route path={PATH.POLICEFORGOTPASSWORD} element={<PoliceForgotPassword />} />
						<Route path={PATH.CITIZENDASHBOARD} element={<CitizenDashboardContent />} />
						<Route path={PATH.POLICEDASHBOARD} element={<PoliceDashboardContent />} />
						<Route path={PATH.ADMINDASHBOARD} element={<AdminDashboardContent />} />
						<Route path={PATH.PAGENOTFOUND} element={<NotFoundContent />} />
					</Routes>
				</>
			) : (
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
					Loading... &nbsp;
					<CircularProgress />
				</Box>
			)}
		</>
	);
}

export default App;
