import React from "react";
import styled from "styled-components";
import { cardStyles } from "./ReusableStyles";

export default function Analytics(props) {
	return (
		<Section>
			<div className="analytic">
				<iframe
					className="iframe"
					style={{ height: "200px", border: "none", borderRadius: "2px" }}
					title="Total Count of Wanted Person"
					src="https://charts.mongodb.com/charts-cirdas-ngmsy/embed/charts?id=63076239-5045-4e80-84ac-660c238b3510&maxDataAge=10&theme=light&autoRefresh=true"
				></iframe>
			</div>
			<div className="analytic">
				<iframe
					className="iframe"
					style={{ height: "200px", border: "none", borderRadius: "2px" }}
					title="Total Count of Wanted Person"
					src="https://charts.mongodb.com/charts-cirdas-ngmsy/embed/charts?id=a79cf58b-b849-48f5-a324-c54557a690b9&maxDataAge=10&theme=light&autoRefresh=true"
				></iframe>
			</div>
			<div className="analytic">
				<iframe
					className="iframe"
					style={{ height: "200px", border: "none", borderRadius: "2px" }}
					title="Total Count of Wanted Person"
					src="https://charts.mongodb.com/charts-cirdas-ngmsy/embed/charts?id=baa240ac-2a68-4d30-bdf1-e0996c41f3bd&maxDataAge=10&theme=light&autoRefresh=true"
				></iframe>
			</div>
			<div className="analytic">
				<iframe
					className="iframe"
					style={{ height: "200px", border: "none", borderRadius: "2px" }}
					title="Total Count of Wanted Person"
					src="https://charts.mongodb.com/charts-cirdas-ngmsy/embed/charts?id=41a497b1-94b4-4700-9a52-59507279f862&maxDataAge=10&theme=light&autoRefresh=true"
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
		padding: 0.5rem 0.5rem;
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
