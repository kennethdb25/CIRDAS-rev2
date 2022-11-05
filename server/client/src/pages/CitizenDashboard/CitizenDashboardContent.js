import React from "react";
import { CitizenDashboard } from "../../components/Component";

const CitizenDashboardContent = (props) => {
	const { fetchData, complaintData, loading } = props;
	return (
		<>
			<CitizenDashboard fetchData={fetchData} complaintData={complaintData} loading={loading} />
		</>
	);
};

export default CitizenDashboardContent;
