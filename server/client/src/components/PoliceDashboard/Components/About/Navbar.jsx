import React, { useContext } from "react";
import styled from "styled-components";
import { LoginContext } from "../../../../context/Context";

export default function Navbar() {
	const { loginData } = useContext(LoginContext);
	return (
		<Nav>
			<div className="title">
				<h4>Hello {loginData.validpolice?.firstName},</h4>
				<h1>
					Welcome to<span>CIRDAS</span>
				</h1>
			</div>
			<div className="title">
				<h1>
					<span>About</span>
				</h1>
			</div>
		</Nav>
	);
}
const Nav = styled.nav`
	display: flex;
	justify-content: space-between;
	color: black;
	font-family: PT Serif;
	.title {
		h4 {
			color: black;
		}
		h1 {
			color: black;
			span {
				margin-left: 0.5rem;
				color: black;
				font-family: "Permanent Marker", cursive;
			}
		}
	}
	@media screen and (min-width: 280px) and (max-width: 1080px) {
		flex-direction: column;
		.title {
			h1 {
				display: flex;
				align-items: center;
				span {
					display: block;

					margin: 0;
					/* letter-spacing: 0; */
				}
			}
		}
	}
`;
