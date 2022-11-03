import React, { useContext } from "react";
import styled from "styled-components";
import male from "../../assets/default.png";
import female from "../../assets/Female.jpg";
import { HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";
import { cardStyles } from "./ReusableStyles";
import { LoginContext } from "../../../../context/Context";
export default function Profile() {
	// eslint-disable-next-line no-unused-vars
	const { loginData, setLoginData } = useContext(LoginContext);
	return (
		<Section>
			<div className="image">
				<img src={loginData.validcitizen?.gender === "Female" ? female : male} alt="" />
			</div>
			<div className="title">
				<h2>{`${loginData.validcitizen?.firstName} ${loginData.validcitizen?.middleName} ${loginData.validcitizen?.lastName}`}</h2>
				<h5>
					<HiOutlineMail /> {`${loginData.validcitizen?.email}`}
				</h5>
				<h5>
					<HiOutlineLocationMarker /> {`${loginData.validcitizen?.address}`}
				</h5>
			</div>
			<div className="info">
				<div className="container">
					<h5>Gender</h5>
					<h3>{`${loginData.validcitizen?.gender}`}</h3>
				</div>
				<div className="container">
					<h5>Birthdate</h5>
					<h3>{`${new Date(loginData.validcitizen?.birthdate).toLocaleDateString()}`}</h3>
				</div>
				<div className="container">
					<h5>Municipality</h5>
					<h3>{`${loginData.validcitizen?.municipal}`}</h3>
				</div>
				<div className="container">
					<h5>Account Status</h5>
					<h3>{`${loginData.validcitizen?.accountstatus}`}</h3>
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
	margin-top: 50px;
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
	}
`;
