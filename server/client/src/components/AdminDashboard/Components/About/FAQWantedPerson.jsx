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
		- You can view information regarding the wanted person.
	</p>
);

const text1 = (
	<p
		style={{
			paddingLeft: 24,
			fontSize: 18,
		}}
	>
		- The importance of this page is used to simultaneously alert police in the Pampanga Police Provincial Office about wanted person.
	</p>
);

const text2 = (
	<p
		style={{
			paddingLeft: 24,
			fontSize: 18,
		}}
	>
		- You need to know the details;
		<br />
		<br />
		● Case
		<br />
		● Height
		<br />
		● Age
		<br />
		● Gender
		<br />
		● Eyes Color
		<br />
		● Hair Color
		<br />
		● Identifying Characteristic
		<br />
	</p>
);

export default function FAQWantedPerson() {
	return (
		<Section>
			<div className="title">
				<MdImportantDevices style={{ fontSize: "25px" }} />
				<h2>Wanted Person's Page</h2>
			</div>
			<Collapse
				bordered={false}
				style={{
					fontSize: 18,
					backgroundColor: "#437fc7",
				}}
			>
				<Panel header="What is the wanted Person page?" key="1">
					{text}
				</Panel>
				<Panel header="What is the importance of this page?" key="2">
					{text1}
				</Panel>
				<Panel header="What to know before filing a wanted person" key="3">
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
