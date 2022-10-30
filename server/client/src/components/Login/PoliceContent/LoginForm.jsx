import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Form, Input, Row, Col } from "antd";
import { Typography, Box, Button, Link } from "@mui/material";
import "antd/dist/antd.min.css";
import useStyles from "./styles";

const LoginForm = () => {
	const classes = useStyles();

	const history = useNavigate();

	const onFinish = async (values) => {
		const data = await fetch("/police/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();
		if (res.status === 201) {
			toast.success("Login Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
			setTimeout(() => {
				localStorage.setItem("policeUserDataToken", res.result.token);
				history("/user-police/dashboard");
			}, 3000);
		} else {
			toast.error(res.error, { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
		}
	};

	const onFinishFailed = (error) => {
		console.log("Failed:", error);
	};

	return (
		<Box className={classes.loginCard}>
			<ToastContainer />
			<Box paddingBottom="20px" paddingTop="20px">
				<Typography fontSize="32px">Police Login</Typography>
			</Box>
			<Form
				name="basic"
				labelCol={{ span: 24 }}
				wrapperCol={{ span: 24 }}
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
				className={classes.Form}
			>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							message: "Email is required!",
							required: true,
						},
						{ whitespace: true },
						{ type: "email", message: "Please enter a valid email" },
					]}
					hasFeedback
				>
					<Input placeholder="Email" />
				</Form.Item>
				<Form.Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: "Password is required!",
						},
					]}
				>
					<Input.Password placeholder="Password" />
				</Form.Item>
				<Box className={classes.loginDetails}>
					<Row gutter={8}>
						<Col span={24}>
							<Form.Item>
								<Typography component={Link} href="/user-police/forgot-password" sx={{ "&:hover": { cursor: "pointer" } }}>
									Forgot Password?
								</Typography>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item>
						<Button type="submit" variant="contained">
							LOGIN
						</Button>
					</Form.Item>
				</Box>
			</Form>
		</Box>
	);
};

export default LoginForm;
