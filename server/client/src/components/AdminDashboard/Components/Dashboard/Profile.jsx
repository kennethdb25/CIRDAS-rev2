import React, { useContext } from "react";
import styled from "styled-components";
import image from "../../assets/default.png";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiAdminLine } from "react-icons/ri";
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
				<h2>{`${loginData.validadmin?.firstName} ${loginData.validadmin?.lastName}`}</h2>
				<h5>
					<HiOutlineLocationMarker /> {`${loginData.validadmin?.address}`}
				</h5>
				<h5>
					<RiAdminLine /> {`${loginData.validadmin?.role}`}
				</h5>
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
