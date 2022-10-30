/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Typography } from "antd";
import styled from "styled-components";
import scrollreveal from "scrollreveal";
import Navbar from "./Navbar";
import FAQComplaint from "./FAQComplaint";
import ListOfAbout from "./ListOfAbout";
import FAQMissingPerson from "./FAQMissingPerson";
import FAQWantedPerson from "./FAQWantedPerson";

const { Title } = Typography;

export default function About() {
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
	}, []);

	return (
		<Section>
			<Navbar />
			<div className="grid">
				<div className="row__one">
					<Title level={4}>ABOUT</Title>
					<ListOfAbout />
					<Title level={4}>FAQ</Title>
					<FAQComplaint />
					<FAQMissingPerson />
					<FAQWantedPerson />
				</div>
			</div>
		</Section>
	);
}

const Section = styled.section`
	margin-left: 18vw;
	padding: 2rem;
	.grid {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 1rem;
		margin-top: 2rem;
		.row__one {
			display: grid;
			grid-template-columns: 1fr;
			height: 50%;
			gap: 1rem;
		}
		.row__two {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
			height: 50%;
		}
	}
	@media screen and (min-width: 280px) and (max-width: 1080px) {
		margin-left: 0;
		.grid {
			.row__one {
				grid-template-columns: 1fr;
				width: 40%;
			}
			.row__two {
				grid-template-columns: 1fr;
				width: 100%;
			}
		}
	}
`;
