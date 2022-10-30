import React from "react";
import styled from "styled-components";
import { IoIosArrowForward } from "react-icons/io";
import { AiFillFileAdd } from "react-icons/ai";
import { MdImportantDevices } from "react-icons/md";
import { cardStyles } from "./ReusableStyles";
export default function FAQMissingPerson() {
	const faqs = [
		{
			icon: <MdImportantDevices />,
			text: "What is Missing Person's Page?",
		},
		{
			icon: <AiFillFileAdd />,
			text: "How to file a missing person?",
		},
		{
			icon: <AiFillFileAdd />,
			text: "What to know before filing missing person?",
		},
	];
	return (
		<Section>
			<div className="title">
				<h2>Missing Person's Page</h2>
			</div>
			<div className="faqs">
				{faqs.map((faq) => {
					return (
						<div className="faq">
							<div className="info">
								{faq.icon}
								<h4>{faq.text}</h4>
							</div>
							<IoIosArrowForward />
						</div>
					);
				})}
			</div>
		</Section>
	);
}
const Section = styled.section`
	${cardStyles};
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
