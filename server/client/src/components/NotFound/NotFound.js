import React from "react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
	return (
		<>
			<div className="container">
				<div style={{ minHeight: "85vh", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
					<img src={require("./404.jpg")} alt="error" style={{ width: "1000px", marginBottom: 20 }} />
					{<h1 className="mb-3">404 ERROR </h1>}
					<h2 className="mb-3">PAGE NOT FOUND</h2>
					<div>
						<NavLink to="/" className="btn btn-primary" style={{ fontSize: 18, justifyContent: "center	" }}>
							Back To CIRDAS Home Page
						</NavLink>
					</div>
				</div>
			</div>
		</>
	);
};

export default NotFound;
