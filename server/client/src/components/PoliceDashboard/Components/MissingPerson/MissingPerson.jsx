import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import Navbar from "./Navbar";
import Analytics from "./Analytics";
import FAQ from "./FAQ";
import MissingPersonTable from "./MissingPersonTable";

export default function MissingPerson() {
	const [getAll, setGetAll] = useState("");
	const [getPending, setGetPending] = useState("");
	const [getMissing, setGetMissing] = useState("");
	const [getFound, setGetFound] = useState("");

	const getFiledMissingPerson = async () => {
		const res = await fetch("/missing-person", {
			method: "Get",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await res.json();
		setGetAll(data?.body.length);
	};

	const getPendingStatus = async () => {
		const res = await fetch("/missing-person/pending", {
			method: "Get",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await res.json();
		setGetPending(data?.body.length);
	};

	const getMissingStatus = async () => {
		const res = await fetch("/missing-person/status", {
			method: "Get",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await res.json();
		setGetMissing(data?.body.length);
	};

	const getFoundStatus = async () => {
		const res = await fetch("/missing-person/found", {
			method: "Get",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await res.json();
		setGetFound(data?.body.length);
	};

	useEffect(() => {
		getFiledMissingPerson();
		getPendingStatus();
		getMissingStatus();
		getFoundStatus();
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
					<Analytics getAll={getAll} getMissing={getMissing} getPending={getPending} getFound={getFound} />
					<FAQ />
				</div>
				<div className="row__one">
					<MissingPersonTable />
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
