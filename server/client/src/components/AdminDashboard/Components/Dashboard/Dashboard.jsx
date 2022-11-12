import React, { useEffect } from "react";
import styled from "styled-components";
import Analytics from "./Analytics";
import Navbar from "./Navbar";
import Profile from "./Profile";
import scrollreveal from "scrollreveal";
import AnnualRateMissing from "./AnnualRateMissing";
import AnnualRateWanted from "./AnnualRateWanted";
import ComplaintRate from "./ComplaintRate";
import MonthlyRateMissing from "./MonthlyRateMissing";
import MonthlyRateWanted from "./MonthlyRateWanted";

export default function Dashboard() {
	useEffect(() => {
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
					<ComplaintRate />
					<Analytics />
				</div>
				<div className="row__two">
					<AnnualRateMissing />
					<Profile />
					<AnnualRateWanted />
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
		.row__three {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
			height: 50%;
		}
	}
	@media screen and (min-width: 280px) and (max-width: 1080px) {
		margin-left: 0;
		.grid {
			.row__one,
			.row__two,
			.row__three {
				grid-template-columns: 1fr;
				width: 100%;
			}
		}
	}
`;
