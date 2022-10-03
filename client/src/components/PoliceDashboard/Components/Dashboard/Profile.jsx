import React, { useContext } from "react";
import styled from "styled-components";
import image from "../../assets/default.png";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { cardStyles } from "./ReusableStyles";
import { LoginContext } from "../../../../context/Context";
export default function Profile() {
	// eslint-disable-next-line no-unused-vars
	const { loginData, setLoginData } = useContext(LoginContext);
	return (
		<Section>
			<div className="image">
				<img src={image} alt="" />
			</div>
			<div className="title">
				<h2>{`${loginData.validpolice?.rank} ${loginData.validpolice?.firstName} ${loginData.validpolice?.lastName}`}</h2>
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
		</Section>
	);
}
const Section = styled.section`
	${cardStyles};
	display: flex;
	flex-direction: column;
	align-items: center;
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
		gap: 1rem;
		.container {
			text-align: center;
		}
	}
`;
