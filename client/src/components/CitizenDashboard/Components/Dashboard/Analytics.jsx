import React, { useContext } from "react";
import styled from "styled-components";
import { BsFileEarmarkMedicalFill, BsFillFileEarmarkXFill } from "react-icons/bs";
import { BiGroup } from "react-icons/bi";
import { cardStyles } from "./ReusableStyles";
import { LoginContext } from "../../../../context/Context";

export default function Analytics(props) {
	const { loginData } = useContext(LoginContext);
	const { data, missing, countMissing, countWanted } = props;
	return (
		<Section>
			<div className="analytic ">
				<div className="content">
					<h4>Filed Complaints</h4>
					<h2>{data}</h2>
				</div>
				<div className="logo">
					<BsFileEarmarkMedicalFill />
				</div>
			</div>
			<div className="analytic">
				<div className="logo">
					<BsFillFileEarmarkXFill />
				</div>
				<div className="content">
					<h4>Filed Missing Person</h4>
					<h2>{missing}</h2>
				</div>
			</div>
			<div className="analytic">
				<div className="logo">
					<BiGroup />
				</div>
				<div className="content">
					<h4>{`${loginData.validcitizen?.municipal}`} Count of Missing Person</h4>
					<h2>{countMissing}</h2>
				</div>
			</div>
			<div className="analytic ">
				<div className="content">
					<h4>{`${loginData.validcitizen?.municipal}`} Count of Wanted Person</h4>
					<h2>{countWanted}</h2>
				</div>
				<div className="logo">
					<BiGroup />
				</div>
			</div>
		</Section>
	);
}
const Section = styled.section`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	.analytic {
		${cardStyles};
		padding: 1rem;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		gap: 1rem;
		transition: 0.5s ease-in-out;
		&:hover {
			background-color: #6daffe;
			color: black;
			svg {
				color: white;
			}
		}
		.logo {
			background-color: black;
			border-radius: 3rem;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 1.5rem;
			svg {
				font-size: 1.7rem;
			}
		}
	}

	@media screen and (min-width: 280px) and (max-width: 720px) {
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		.analytic {
			&:nth-of-type(3),
			&:nth-of-type(4) {
				flex-direction: row-reverse;
			}
		}
	}
`;
