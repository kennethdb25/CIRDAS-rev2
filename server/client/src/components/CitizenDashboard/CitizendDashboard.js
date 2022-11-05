import React from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";

import Sidebar from "./Components/Dashboard/Sidebar";
export default function CitizenDashboard(props) {
	const { fetchData, complaintData, loading } = props;
	return (
		<Div>
			<ToastContainer />
			<Sidebar fetchData={fetchData} complaintData={complaintData} loading={loading} />
		</Div>
	);
}

const Div = styled.div`
	position: relative;
`;
