import React from "react";
import styled from "styled-components";
import { MdImportantDevices } from "react-icons/md";
import { cardStyles } from "./ReusableStyles";
import { Collapse } from "antd";

const { Panel } = Collapse;

const text = (
	<p
		style={{
			paddingLeft: 24,
			fontSize: 18,
		}}
	>
		- Where you can file a complaint , view information, and change their information on this page.
	</p>
);

const text1 = (
	<p
		style={{
			paddingLeft: 24,
			fontSize: 18,
		}}
	>
		- To file a complaint kindly fill out the following details;
		<br />
		<br />
		● What (Complaint)
		<br />
		● Contact number
		<br />
		● Where (Crime Location)
		<br />
		● Municipality
		<br />
		● Time and Date
		<br />
		● Victim name
		<br />
		● Witness name
		<br />
		● Suspect name
		<br />
		● How (Description)
		<br />
	</p>
);

const text2 = (
	<p
		style={{
			paddingLeft: 24,
			fontSize: 18,
		}}
	>
		● Rape
		<br />
		● Libel
		<br />
		● Alarm and Scandal
		<br />
		● Robbery
		<br />
		● Physical Injury
		<br />
		● Murder
		<br />
	</p>
);

export default function FAQComplaint() {
	return (
		<Section>
			<div className="title">
				<MdImportantDevices style={{ fontSize: "25px" }} />
				<h2>Complaint Page</h2>
			</div>
			<Collapse
				bordered={false}
				style={{
					fontSize: 18,
					backgroundColor: "#437fc7",
				}}
			>
				<Panel header="What is a compliant page?" key="1">
					{text}
				</Panel>
				<Panel header="How to file a Complaint?" key="2">
					{text1}
				</Panel>
				<Panel header="What are the complaints that you can file?" key="3">
					{text2}
				</Panel>
			</Collapse>
		</Section>
	);
}
const Section = styled.section`
	${cardStyles};
	.title {
		display: flex;
		align-items: "center";
		gap: 1rem;
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
