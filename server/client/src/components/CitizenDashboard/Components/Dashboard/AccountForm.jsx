import React, { useState } from "react";
import { Drawer, Space } from "antd";

const AccountForm = () => {
	const [visible, setVisible] = useState(true);

	const onClose = () => {
		setVisible(false);
	};
	return (
		<div>
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
		</div>
	);
};

export default AccountForm;
