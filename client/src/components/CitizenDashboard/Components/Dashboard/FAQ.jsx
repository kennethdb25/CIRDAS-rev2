import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowForward } from "react-icons/io";
import { AiFillFileAdd } from "react-icons/ai";
import { MdImportantDevices } from "react-icons/md";
import { cardStyles } from "./ReusableStyles";
import { Modal, Typography } from "antd";
export default function FAQ() {
	const [isView, setIsView] = useState(false);
	return (
		<Section>
			<div className="title">
				<h2>Information about CIRDAS System</h2>
			</div>
			<div className="faqs">
				<div className="faq">
					<div className="info">
						<MdImportantDevices />
						<h4>What is the importance of CIRDAS?</h4>
					</div>
					<IoIosArrowForward
						onClick={() => {
							setIsView(true);
						}}
					/>
				</div>
				<div className="faq">
					<div className="info">
						<AiFillFileAdd />
						<h4>How to file a complaint?</h4>
					</div>
					<IoIosArrowForward />
				</div>
				<div className="faq">
					<div className="info">
						<AiFillFileAdd />
						<h4>People behind CIRDAS System</h4>
					</div>
					<IoIosArrowForward />
				</div>
			</div>
			<Modal title="What is the importance of CIRDAS?" visible={isView} onCancel={() => setIsView(false)} onOk={() => setIsView(false)}>
				<Typography>Lorem Ipsum</Typography>
			</Modal>
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
