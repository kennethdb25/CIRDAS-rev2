import React, { useState } from "react";
import { Drawer, Space } from "antd";
import styled from "styled-components";
import { Button } from "antd";

export default function Action() {
	const [visible, setVisible] = useState(false);

	const onClose = () => {
		setVisible(false);
	};

	return (
		<Section>
			<div className="analytic ">
				<div className="content">
					<Button type="primary" onClick={() => setVisible(true)}>
						UPDATE PROFILE
					</Button>
				</div>
			</div>
			<div className="analytic">
				<div className="content">
					<Button type="primary" danger>
						CHANGE PASSWORD
					</Button>
				</div>
			</div>
			<div className="analytic">
				<div className="content">
					<Button type="primary">UPLOADED DOCUMENTS</Button>
				</div>
			</div>
			<div className="analytic">
				<div className="content">
					<Button type="primary" danger>
						DELETE ACCOUNT
					</Button>
				</div>
			</div>
			<Drawer
				title="Account Details"
				placement="top"
				width={500}
				onClose={onClose}
				open={visible}
				height={630}
				style={{
					display: "flex",
					justifyContent: "center",
				}}
				extra={<Space></Space>}
			></Drawer>
		</Section>
	);
}
const Section = styled.section`
	display: grid;
	grid-template-columns: 1fr
	margin-top: 2.1rem;
	.analytic {
		padding: 0.7rem;
		display: flex;
		justify-content: center;
		align-items: center;
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
