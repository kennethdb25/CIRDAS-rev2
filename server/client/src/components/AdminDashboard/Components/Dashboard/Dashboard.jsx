import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import Analytics from "./Analytics";
import RateMissingPerson from "./RateMissingPerson";
import FAQ from "./FAQ";
import Navbar from "./Navbar";
import Profile from "./Profile";
import RateWanterdPerson from "./RateWanterdPerson";
import scrollreveal from "scrollreveal";
import { LoginContext } from "../../../../context/Context";

export default function Dashboard() {
	const [data, setData] = useState("");
	const [missing, setMissing] = useState("");
	const [countMissing, setCountMissing] = useState("");
	const [countWanted, setCountWanted] = useState("");
	// const [graphMissing, setGraphMissing] = useState([]);
	const { loginData } = useContext(LoginContext);

	const getFiledMissingPerson = async () => {
		const res = await fetch(`/missing-person`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const dataMiss = await res.json();
		setMissing(dataMiss.body.length);
	};

	const getFiledComplaint = async () => {
		const res = await fetch(`/citizen/complaint`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const dataComp = await res.json();
		setData(dataComp.body.length);
	};

	const municipalCountMissingPerson = async () => {
		const res = await fetch(`/missing-person/count/${loginData.validpolice?.municipal}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const compCount = await res.json();
		setCountMissing(compCount.getMissingCount);
	};

	const municipalCountWantedPerson = async () => {
		const res = await fetch(`/wanted-person/count/${loginData.validpolice?.municipal}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const wantedCount = await res.json();
		setCountWanted(wantedCount.getWantedCount);
	};

	useEffect(() => {
		getFiledComplaint();
		getFiledMissingPerson();
		municipalCountMissingPerson();
		municipalCountWantedPerson();
		const sr = scrollreveal({
			origin: "bottom",
			distance: "80px",
			duration: 2000,
			reset: false,
		});
		sr.reveal(
			`
        nav,
        .row__one,
        .row__two
    `,
			{
				opacity: 0,
				interval: 100,
			}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Section>
			<Navbar />
			<div className="grid">
				<div className="row__one">
					<Analytics data={data} missing={missing} countMissing={countMissing} countWanted={countWanted} />
					<FAQ />
				</div>
				<div className="row__two">
					<RateMissingPerson />
					<Profile />
					<RateWanterdPerson />
				</div>
			</div>
		</Section>
	);
}

const Section = styled.section`
	margin-left: 18vw;
	padding: 2rem;
	.grid {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 1rem;
		margin-top: 2rem;
		.row__one {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			height: 50%;
			gap: 1rem;
		}
		.row__two {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 1rem;
			height: 50%;
		}
	}
	@media screen and (min-width: 280px) and (max-width: 1080px) {
		margin-left: 0;
		.grid {
			.row__one,
			.row__two {
				grid-template-columns: 1fr;
				width: 100%;
			}
		}
	}
`;
