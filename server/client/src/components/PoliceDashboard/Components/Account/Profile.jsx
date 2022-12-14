import React, { useEffect } from "react";
import styled from "styled-components";
import male from "../../assets/default.png";
import female from "../../assets/Female.jpg";
import { HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";
import { cardStyles } from "./ReusableStyles";
import Action from "./Action";
export default function Profile(props) {
	const { loginData, ValidUser } = props;

	useEffect(() => {
		ValidUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Section>
			<div className="image">
				<img src={loginData.validpolice?.gender === "Female" ? female : male} alt="" />
			</div>
			<div className="title">
				<h2>{`${loginData.validpolice?.rank} ${loginData.validpolice?.firstName} ${loginData.validpolice?.lastName}`}</h2>
				<h5>
					<HiOutlineMail /> {`${loginData.validpolice?.email}`}
				</h5>
				<h5>
					<HiOutlineLocationMarker /> {`${loginData.validpolice?.address}`}
				</h5>
			</div>
			<div className="info">
				<div className="container">
					<h5>Gender</h5>
					<h3>{`${loginData.validpolice?.gender}`}</h3>
				</div>
				<div className="container">
					<h5>Birthdate</h5>
					<h3>{`${new Date(loginData.validpolice?.birthdate).toLocaleDateString()}`}</h3>
				</div>
				<div className="container">
					<h5>Municipality</h5>
					<h3>{`${loginData.validpolice?.municipal}`}</h3>
				</div>
			</div>
			<div className="action">
				<Action ValidUser={ValidUser} loginData={loginData} />
			</div>
		</Section>
	);
}
const Section = styled.section`
	${cardStyles};
	display: flex;
	flex-direction: column;
	align-items: center;
	// margin-top: 50px;
	gap: 1rem;
	.image {
		max-height: 10rem;
		overflow: hidden;
		border-radius: 20rem;
		img {
			height: 11rem;
			width: 10rem;
			object-fit: cover;
			border-radius: 20rem;
			transition: 0.5s ease-in-out;
		}
		&:hover {
			img {
				transform: scale(1.1);
			}
		}
	}
	.title {
		text-align: center;
		h2,
		h5 {
			color: white;
			font-family: "Montserrat";
			letter-spacing: 0.3rem;
		}
		h5 {
			letter-spacing: 0.2rem;
		}
	}
	.info {
		display: flex;
		gap: 2rem;
		.container {
			text-align: center;
		}
	}
	@media screen and (min-width: 280px) and (max-width: 1080px) {
		width: 100%;
		.info {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
			font-size: 12px;
		}
		.action {
			display: grid;
			grid-template-columns: 1fr;
			gap: 1rem;
			font-size: 12px;
		}
	}
`;
