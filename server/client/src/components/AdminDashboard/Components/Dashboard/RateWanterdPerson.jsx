import React from "react";
import styled from "styled-components";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { cardStyles } from "./ReusableStyles";
const data = [
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 2,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
	{
		data: 1,
	},
];
export default function RateWanterdPerson() {
	return (
		<Section>
			<div className="top">
				<div className="info">
					<h4>Provincial Rate for Wanted Person</h4>
					<h1>1</h1>
				</div>
			</div>
			<div className="chart">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart width={500} height={400} data={data} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
						<Tooltip cursor={false} />
						<Area animationBegin={800} animationDuration={2000} type="monotone" dataKey="data" stroke="#6daffe" fill="#8068233e" strokeWidth={4} />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</Section>
	);
}
const Section = styled.section`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 20rem;
	${cardStyles}
	padding: 2rem 0 0 0;
	.top {
		.info {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.2rem;
			h1 {
				font-size: 2rem;
			}
			.growth {
				background-color: #d7e41e1d;
				padding: 0.5rem;
				border-radius: 1rem;
				transition: 0.3s ease-in-out;
				&:hover {
					background-color: #ffc107;
					span {
						color: black;
					}
				}
				span {
					color: #ffc107;
				}
			}
		}
	}
	.chart {
		height: 70%;
		.recharts-default-tooltip {
			background-color: black !important;
			border-color: black !important;
		}
	}
	@media screen and (min-width: 280px) and (max-width: 1080px) {
	}
`;
