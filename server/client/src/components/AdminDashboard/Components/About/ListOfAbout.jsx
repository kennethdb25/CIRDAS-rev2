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
		- The main aim of CIRDAS is to secure and make privacy on crime related data over manually data storage. This web and mobile based project is made for
		providing information and awareness about crimes.
	</p>
);

const text1 = (
	<p
		style={{
			paddingLeft: 24,
			fontSize: 18,
		}}
	>
		- Data Privacy Consent.
	</p>
);

const text2 = (
	<p
		style={{
			paddingLeft: 24,
			fontSize: 18,
		}}
	>
		- Dela Cruz ,Jhames Robert
		<br />
		- Dimitui, Camille
		<br />
		- Lingat Angelo Gabriel
		<br />
		- Macapagal, Shiena Marie
		<br />
		- Simon, Albert Jr.
		<br />- Yambao, Christopher
	</p>
);

export default function ListOfAbout() {
	return (
		<Section>
			<div className="title">
				<MdImportantDevices style={{ fontSize: "25px" }} />
				<h2>Information about CIRDAS System</h2>
			</div>
			<Collapse
				bordered={false}
				style={{
					fontSize: 18,
					backgroundColor: "#437fc7",
				}}
			>
				<Panel header="What is the importance of CIRDAS?" key="1">
					{text}
				</Panel>
				<Panel header="Data Privacy Consent" key="2">
					{text1}
				</Panel>
				<Panel header="People behind CIRDAS System" key="3">
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
