import React from "react";
import styled from "styled-components";
import { cardStyles } from "./ReusableStyles";
export default function AnnualRateMissing() {
	return (
		<Section>
			<iframe
				className="iframe"
				style={{
					height: "100%",
					width: "100%",
					border: "none",
					borderRadius: "2px",
					boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
					backgroundColor: "white",
				}}
				title="Provincial Rate of Missing Person (Annual)"
				src="https://charts.mongodb.com/charts-cirdas-ngmsy/embed/charts?id=63259d56-adfc-4240-83c0-600961fd3fdd&maxDataAge=10&theme=light&autoRefresh=true"
			></iframe>
		</Section>
	);
}
const Section = styled.section`
	${cardStyles};
	display: flex;
	.title {
		h2 {
			color: white;
			font-family: "Montserrat";
			letter-spacing: 0.3rem;
		}
	}
	.faqs {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
		.faq {
			display: flex;
			align-items: center;
			justify-content: space-between;
			cursor: pointer;
			.info {
				display: flex;
				gap: 1rem;
				align-items: center;
			}
			svg {
				font-size: 1.4rem;
			}
			&:nth-of-type(2) {
				border-top: 0.01rem solid #6c6e6e;
				border-bottom: 0.01rem solid #6c6e6e;
				padding: 0.8rem 0;
			}
		}
	}
	@media screen and (min-width: 280px) and (max-width: 1080px) {
		svg {
			font-size: 2rem !important;
		}
	}
`;
