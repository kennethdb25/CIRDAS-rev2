/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import Navbar from "./Navbar";
import Profile from "./Profile";

export default function Account() {
	const [loginData, setLoginData] = useState([]);
	// COMPLAINT TABLE

	const ValidUser = async () => {
		let validToken = localStorage.getItem("policeUserDataToken");
		const res = await fetch("/validpolice", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: validToken,
			},
		});

		const fetchedData = await res.json();

		if (!fetchedData) {
			console.log("user not valid");
		} else {
			console.log("user verified");
			setLoginData(fetchedData);
		}
	};

	useEffect(() => {
		ValidUser();
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
					<Profile ValidUser={ValidUser} loginData={loginData} />
				</div>
				<div className="row__one"></div>
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
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			grid-template-columns: 1fr
			height: 100%;
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
