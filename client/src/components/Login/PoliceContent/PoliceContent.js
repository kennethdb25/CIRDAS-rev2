import React from "react";
import { Box } from "@mui/material";
import useStyles from "./styles";
import LoginForm from "./LoginForm";

const PoliceContent = () => {
	const classes = useStyles();

	return (
		<Box className={classes.loginContainer}>
			<LoginForm />
		</Box>
	);
};

export default PoliceContent;
