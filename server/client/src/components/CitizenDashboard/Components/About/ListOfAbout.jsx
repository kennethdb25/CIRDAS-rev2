import React, { useState } from "react";
import styled from "styled-components";
import { MdImportantDevices } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { GoPrimitiveDot } from "react-icons/go";
import { cardStyles } from "./ReusableStyles";
import { Modal, Typography } from "antd";
export default function ListOfAbout() {
	const [isView, setIsView] = useState(false);
	return (
		<Section>
			<div className="title">
				<MdImportantDevices style={{ fontSize: "25px" }} />
				<h2>Information about CIRDAS System</h2>
			</div>
			<div className="faqs">
				<div
					className="faq"
					onClick={() => {
						setIsView(true);
					}}
				>
					<div className="info">
						<GoPrimitiveDot />
						<h4>What is the importance of CIRDAS?</h4>
					</div>
					<IoIosArrowForward />
				</div>
				<div className="faq">
					<div className="info">
						<GoPrimitiveDot />
						<h4>Data Privacy Consent</h4>
					</div>
					<IoIosArrowForward />
				</div>
				<div className="faq">
					<div className="info">
						<GoPrimitiveDot />
						<h4>People behind CIRDAS System</h4>
					</div>
					<IoIosArrowForward />
				</div>
			</div>
			<Modal title="What is the importance of CIRDAS?" open={isView} onCancel={() => setIsView(false)} onOk={() => setIsView(false)}>
				<Typography>Lorem Ipsum</Typography>
			</Modal>
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
