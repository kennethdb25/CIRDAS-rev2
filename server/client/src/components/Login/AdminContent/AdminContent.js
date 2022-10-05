import React from "react";
import { Box } from "@mui/material";
import useStyles from "./styles";
import LoginForm from "./LoginForm";

const AdminContent = () => {
	const classes = useStyles();

	return (
		<Box className={classes.loginContainer}>
			<LoginForm />
		</Box>
	);
};

export default AdminContent;
