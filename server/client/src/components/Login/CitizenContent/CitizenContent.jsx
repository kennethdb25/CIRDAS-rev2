import React, { useState } from "react";
import { Box } from "@mui/material";
import useStyles from "./styles";
import { Drawer, Space } from "antd";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

const CitizenContent = () => {
	const [visible, setVisible] = useState(false);

	const classes = useStyles();

	const showRegistration = () => {
		setVisible(true);
	};

	const onClose = () => {
		setVisible(false);
	};

	return (
		<Box className={classes.loginContainer}>
			<LoginForm showRegistration={showRegistration} />
			<Drawer
				title="Create An Account"
				placement="left"
				width={900}
				onClose={onClose}
				open={visible}
				height={600}
				style={{
					display: "flex",
					justifyContent: "center",
				}}
				extra={<Space></Space>}
			>
				<RegistrationForm onClose={onClose} />
			</Drawer>
		</Box>
	);
};

export default CitizenContent;
