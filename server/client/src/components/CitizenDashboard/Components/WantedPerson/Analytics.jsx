import React from "react";
import styled from "styled-components";

import { cardStyles } from "./ReusableStyles";

export default function Analytics() {
	return (
		<Section>
			<div className="analytic">
				<iframe
					className="iframe"
					style={{
						height: "400px",
						border: "none",
						borderRadius: "2px",
						width: "100%",
						boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
						backgroundColor: "white",
					}}
					title="Total Count of Wanted Person"
					src="https://charts.mongodb.com/charts-cirdas-ngmsy/embed/charts?id=634ad6b5-847c-4f82-852b-759063dfbf05&maxDataAge=10&theme=light&autoRefresh=true"
				></iframe>
			</div>
		</Section>
	);
}
const Section = styled.section`
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;
	.analytic {
		${cardStyles};
		padding: 1.5rem 1.5rem;
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
