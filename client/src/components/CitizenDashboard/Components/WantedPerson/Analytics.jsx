import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { BsFileEarmarkMedicalFill, BsFillFileEarmarkXFill } from "react-icons/bs";
import { BiGroup } from "react-icons/bi";
import { cardStyles } from "./ReusableStyles";
import { LoginContext } from "../../../../context/Context";

export default function Analytics() {
	const [data, setData] = useState("");
	const [missing, setMissing] = useState("");
	const [countMissing, setCountMissing] = useState("");
	const { loginData } = useContext(LoginContext);

	useEffect(() => {
		getFiledComplaint();
		getFiledMissingPerson();
		municipalCountMissingPerson();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getFiledMissingPerson = async () => {
		const res = await fetch(`/missing-person/${loginData.validcitizen?._id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const dataMiss = await res.json();
		setMissing(dataMiss.body.length);
	};

	const getFiledComplaint = async () => {
		const res = await fetch(`/citizen/complaint/${loginData.validcitizen?._id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const dataComp = await res.json();
		setData(dataComp.body.length);
	};

	const municipalCountMissingPerson = async () => {
		const res = await fetch(`/missing-person/count/${loginData.validcitizen?.municipal}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const compCount = await res.json();
		setCountMissing(compCount.getMissingCount);
	};

	return (
		<Section>
			<div className="analytic ">
				<iframe
					className="iframe"
					style={{ height: "200px", border: "none", borderRadius: "2px", boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)" }}
					title="Wanted Person Status Rate"
					src="https://charts.mongodb.com/charts-cirdas-ngmsy/embed/charts?id=63076239-5045-4e80-84ac-660c238b3510&maxDataAge=10&theme=light&autoRefresh=true"
				></iframe>
			</div>
			<div className="analytic">
				<iframe
					className="iframe"
					style={{ height: "200px", border: "none", borderRadius: "2px", boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)" }}
					title="Total Count of Wanted Person"
					src="https://charts.mongodb.com/charts-cirdas-ngmsy/embed/charts?id=6326c127-ebcf-4825-8adf-864e79b72889&maxDataAge=10&theme=light&autoRefresh=true"
				></iframe>
			</div>
		</Section>
	);
}
const Section = styled.section`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	.analytic {
		${cardStyles};
		padding: 0.5rem;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		gap: 1rem;
		transition: 0.5s ease-in-out;
		&:hover {
			background-color: #6daffe;
			color: black;
			svg {
				color: white;
			}
		}
		
		}
		.logo {
			background-color: black;
			border-radius: 3rem;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 1.5rem;
			svg {
				font-size: 1.7rem;
			}
		}
	}

	@media screen and (min-width: 280px) and (max-width: 720px) {
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		.analytic {
			&:nth-of-type(3),
			&:nth-of-type(4) {
				flex-direction: row-reverse;
			}
		}
	}
`;
