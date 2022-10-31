import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Row, Col } from "antd";
import { Typography, Box, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "antd/dist/antd.min.css";
import useStyles from "./style";
import emailjs from "@emailjs/browser";

const PoliceForgotPasswordContent = () => {
	const classes = useStyles();
	const [form] = Form.useForm();
	const [email, setEmail] = useState("");
	const [step1, setStep1] = useState(true);
	const [step2, setStep2] = useState(false);
	const [step3, setStep3] = useState(false);
	const [step4, setStep4] = useState(false);
	const [OTP, setOTP] = useState("");
	const [sendButtonLabel, setSendButtonLabel] = useState("Send");
	const history = useNavigate();

	const onFinish = async (values) => {
		const data = await fetch(`/police/forgot-password/${values.email}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const res = await data.json();
		if (res.status === 200) {
			setEmail(values.email);
			setStep1(false);
			setStep2(true);
			setOTP(Math.floor(100000 + Math.random() * 900000));
		} else {
			toast.error(res.body, { position: toast.POSITION.TOP_CENTER, autoClose: 500 });
		}
	};

	const onFinishFailed = (errorInfo) => {
		toast.error("Something went wrong, please try again later", { position: toast.POSITION.TOP_CENTER, autoClose: 500 });
	};

	const sendOTP = () => {
		setSendButtonLabel("Resend");
		emailjs.send(
			"service_jbrkjkq",
			"template_oaglew2",
			{
				otp: OTP,
				userEmail: email,
			},
			"Rrr2ni7hSkVnvdHw2"
		);
	};

	const onFinish2 = (values) => {
		// eslint-disable-next-line eqeqeq
		if (values.code == OTP) {
			setStep2(false);
			setStep3(true);
			setSendButtonLabel("Send");
		}
	};

	const onFinishFailed2 = (errorInfo) => {
		toast.error("Something went wrong, please try again later", { position: toast.POSITION.TOP_CENTER, autoClose: 500 });
	};
	const onFinish3 = async (values) => {
		const data = await fetch(`/police/forgot-password/${values.email}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();
		if (res.status === 200) {
			setStep3(false);
			setStep4(true);
			form.resetFields();
		}
	};

	const backToLogin = () => {
		setStep4(false);
		setStep1(true);
		history("/");
	};

	const onFinishFailed3 = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Box className={classes.loginContainer}>
			<ToastContainer />
			<Box className={classes.loginCard}>
				<Box paddingTop="20px">
					<Typography fontSize="28px">Yo! Forgot Your Password?</Typography>
				</Box>
				{step1 ? (
					<>
						<Typography fontSize="12px">No worries! Just enter your email and we wil send you a reset</Typography>
						<Form
							form={form}
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
										type: "email",
										required: true,
										message: "Please input your email!",
									},
									{ whitespace: true },
								]}
								hasFeedback
							>
								<Input placeholder="Email" />
							</Form.Item>

							<Form.Item>
								<Button type="submit" variant="contained">
									Submit
								</Button>
							</Form.Item>
						</Form>
					</>
				) : null}
				{step2 ? (
					<>
						<Typography fontSize="16px">Please verify the 6 digits OTP in your email</Typography>
						<Form
							name="basic"
							labelCol={{ span: 24 }}
							wrapperCol={{ span: 24 }}
							initialValues={{
								remember: true,
							}}
							onFinish={onFinish2}
							onFinishFailed={onFinishFailed2}
							autoComplete="off"
							className={classes.Form}
						>
							<Form.Item
								label="6-digits code"
								name="code"
								rules={[
									{
										required: true,
										message: "Please input your OTP!",
									},

									{ min: 6 },
									{ max: 6 },
								]}
								hasFeedback
							>
								<Input placeholder="6-digits code" />
							</Form.Item>

							<Form.Item>
								<Button type="submit" variant="contained">
									Submit
								</Button>
							</Form.Item>
						</Form>
						<Button onClick={sendOTP}>{sendButtonLabel}</Button>
					</>
				) : null}
				{step3 ? (
					<>
						<Typography fontSize="16px">You can now reset your password</Typography>
						<Form
							name="basic"
							labelCol={{ span: 24 }}
							wrapperCol={{ span: 24 }}
							onFinish={onFinish3}
							onFinishFailed={onFinishFailed3}
							autoComplete="off"
							className={classes.Form}
							initialValues={{ email: email }}
						>
							<Form.Item hidden label="Email" name="email">
								<Input value={email} />
							</Form.Item>
							<Row gutter={12}>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item
										label="Password"
										name="password"
										labelCol={{
											span: 24,
										}}
										wrapperCol={{
											span: 24,
										}}
										hasFeedback
										rules={[
											{
												required: true,
												message: "Please input your password!",
											},
											{ whitespace: true },
											{ min: 8 },
											{ max: 26 },
											{
												pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,26}$/,
												message: "Must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
											},
										]}
									>
										<Input.Password placeholder="Password" />
									</Form.Item>
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item
										label="Confirm Password"
										name="confirmpassword"
										labelCol={{
											span: 24,
											//offset: 2
										}}
										wrapperCol={{
											span: 24,
											//offset: 2
										}}
										hasFeedback
										dependencies={["password"]}
										rules={[
											{
												required: true,
											},
											({ getFieldValue }) => ({
												validator(_, value) {
													if (!value || getFieldValue("password") === value) {
														return Promise.resolve();
													}

													return Promise.reject("Passwords does not matched.");
												},
											}),
										]}
									>
										<Input.Password placeholder="Confirm Password" />
									</Form.Item>
								</Col>
							</Row>

							<Form.Item>
								<Button type="submit" variant="contained">
									Submit
								</Button>
							</Form.Item>
						</Form>
					</>
				) : null}
				{step4 ? (
					<>
						<Typography fontSize="10px">We are pleased to inform you that recovery has been successfully done!</Typography>
						<Button type="success" onClick={backToLogin}>
							Back to Login
						</Button>
					</>
				) : null}
			</Box>
		</Box>
	);
};

export default PoliceForgotPasswordContent;
