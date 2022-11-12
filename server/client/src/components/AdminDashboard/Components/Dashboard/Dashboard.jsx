import React, { useEffect } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import scrollreveal from "scrollreveal";

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
				<iframe
					title="Dashboard"
					style={{
						height: "100%",
						width: "100%",
						border: "none",
						borderRadius: "2px",
						boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
						backgroundColor: "white",
					}}
					src="https://charts.mongodb.com/charts-cirdas-ngmsy/embed/dashboards?id=6305a9df-602a-4598-8e3d-04b18cad7b7c&theme=light&autoRefresh=true&maxDataAge=10&showTitleAndDesc=true&scalingWidth=fixed&scalingHeight=fixed"
				></iframe>
			</div>
		</Section>
	);
}

const Section = styled.section`
	margin-left: 18vw;
	padding: 2rem;
	height: 100vh;
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
