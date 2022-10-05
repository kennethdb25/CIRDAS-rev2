import React, { useEffect } from "react";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import Navbar from "./Navbar";
import Analytics from "./Analytics";

export default function PoliceStationDetails() {
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
	}, []);
	return (
		<Section>
			<Navbar />
			<div className="grid">
				<div className="row__one">
					<Analytics />
				</div>
				<div className="row__one">
					<iframe
						className="iframe"
						style={{ height: "500px", width: "100%", border: "none", borderRadius: "2px", boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)" }}
						title="Wanted Person Status Rate"
						src="https://charts.mongodb.com/charts-cirdas-ngmsy/embed/charts?id=63298e7c-7e44-46b5-8293-fa65c5bc95a9&maxDataAge=10&theme=light&autoRefresh=true"
					></iframe>
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
