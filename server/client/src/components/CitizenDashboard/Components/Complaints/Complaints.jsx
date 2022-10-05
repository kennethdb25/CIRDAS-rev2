import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import Navbar from "./Navbar";
import Analytics from "./Analytics";
import FAQ from "./FAQ";
import ComplaintTable from "./ComplaintTable";
import { LoginContext } from "../../../../context/Context";

export default function Complaints() {
	const [data, setData] = useState("");
	const [getPending, setGetPending] = useState("");
	const [getReviewed, setGetReviewed] = useState("");
	const [getUnder, setGetUnder] = useState("");
	const { loginData } = useContext(LoginContext);

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

	const getPendingComplaints = async () => {
		const res = await fetch(`/citizen/complaint/Pending/${loginData.validcitizen?._id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const pending = await res.json();
		setGetPending(pending);
	};

	const getReviewedComplaints = async () => {
		const res = await fetch(`/citizen/complaintss/Reviewed/${loginData.validcitizen?._id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const pending = await res.json();
		setGetReviewed(pending);
	};

	const getUnderInvestigation = async () => {
		const res = await fetch(`/citizen/complaints/ForInvestigation/${loginData.validcitizen?._id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const pending = await res.json();
		setGetUnder(pending);
	};

	useEffect(() => {
		getFiledComplaint();
		getPendingComplaints();
		getReviewedComplaints();
		getUnderInvestigation();
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
	}, []);
	return (
		<Section>
			<Navbar />
			<div className="grid">
				<div className="row__two">
					<Analytics data={data} getPending={getPending} getReviewed={getReviewed} getUnder={getUnder} />
					<FAQ />
				</div>
				<div className="row__one">
					<ComplaintTable
						getFiledComplaint={getFiledComplaint}
						getPendingComplaints={getPendingComplaints}
						getReviewedComplaints={getReviewedComplaints}
						getUnderInvestigation={getUnderInvestigation}
					/>
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
			grid-template-columns: 1fr;
			height: 50%;
			gap: 1rem;
		}
		.row__two {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
			height: 50%;
		}
	}
	@media screen and (min-width: 280px) and (max-width: 1080px) {
		margin-left: 0;
		.grid {
			.row__one {
				grid-template-columns: 1fr;
				width: 40%;
			}
			.row__two {
				grid-template-columns: 1fr;
				width: 100%;
			}
		}
	}
`;
