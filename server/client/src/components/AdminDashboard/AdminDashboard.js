import React from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";

import Sidebar from "./Components/Dashboard/Sidebar";
export default function AdminDashboard() {
	return (
		<Div>
			<ToastContainer />
			<Sidebar />
		</Div>
	);
}

const Div = styled.div`
	position: relative;
`;
