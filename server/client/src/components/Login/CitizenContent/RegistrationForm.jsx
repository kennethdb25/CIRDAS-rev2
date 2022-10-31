import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Radio, Select, Row, Col, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import "antd/dist/antd.min.css";
import { MunicipalData } from "../../../data/CitizensData";
import useStyles from "./styles";
import emailjs from "@emailjs/browser";

const RegistrationForm = (props) => {
	const classes = useStyles();
	const [form] = Form.useForm();
	const [final, setFinal] = useState({});
	const [step1, setStep1] = useState(true);
	const [step2, setStep2] = useState(false);
	const [OTP, setOTP] = useState("");
	const [sendButtonLabel, setSendButtonLabel] = useState("Send");

	const onFinish = (values) => {
		setFinal(values);
		setStep1(false);
		setStep2(true);
		setOTP(Math.floor(100000 + Math.random() * 900000));
	};

	const onFinishFailed = (error) => {
		message.error("Something went wrong! Please try again later.");
	};
	const sendOTP = () => {
		setSendButtonLabel("Resend");
		emailjs.send(
			"service_jbrkjkq",
			"template_t8y0k4w",
			{
				otp: OTP,
				userEmail: final.email,
			},
			"Rrr2ni7hSkVnvdHw2"
		);
	};

	const onStep2 = async (values) => {
		const newdata = new FormData();
		newdata.append("photo", final.photo.file.originFileObj);
		newdata.append("address", final.address);
		newdata.append("birthdate", final.birthdate);
		newdata.append("confirmpassword", final.confirmpassword);
		newdata.append("email", final.email);
		newdata.append("firstName", final.firstName);
		newdata.append("gender", final.gender);
		newdata.append("lastName", final.lastName);
		newdata.append("municipal", final.municipal);
		newdata.append("middleName", final.middleName);
		newdata.append("password", final.password);
		// eslint-disable-next-line eqeqeq
		if (values.code == OTP) {
			const data = await fetch("/citizen/register", {
				method: "POST",
				body: newdata,
			});

			const res = await data.json();
			if (res.status === 201) {
				toast.success("Registered Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
				props.onClose();
				form.resetFields();
				setStep1(true);
				setStep2(false);
				setSendButtonLabel("Send");
				setOTP("");
			} else {
				toast.error(res.error, { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
			}
		} else {
			toast.error("Invalid Code", { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
		}
	};

	const onStep2Failed = (error) => {
		message.error("Something went wrong! Please try again later.");
	};

	const imgprops = {
		beforeUpload: (file) => {
			const isIMG = file.type.startsWith("image");

			if (!isIMG) {
				message.error(`${file.name} is not an image`);
			}

			return isIMG || Upload.LIST_IGNORE;
		},
		onChange: (info) => {
			console.log(info.fileList);
		},
	};

	const onPreview = async (file) => {
		let src = file.url;

		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);

				reader.onload = () => resolve(reader.result);
			});
		}

		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow?.document.write(image.outerHTML);
	};

	return (
		<>
			{step1 ? (
				<Form
					form={form}
					labelCol={{
						span: 8,
					}}
					layout="horizontal"
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
					style={{
						width: "100%",
					}}
				>
					<Row>
						<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
						<Col xs={{ span: 24 }} md={{ span: 16 }}>
							<Row gutter={12}>
								<Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
									<Form.Item
										label="First Name"
										name="firstName"
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
												message: "Please input your first name!",
											},
											{
												pattern: /^[a-zA-Z_ ]*$/,
												message: "First name should have no number.",
											},
										]}
									>
										<Input placeholder="Enter your first name" />
									</Form.Item>
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item
										label="Middle Name"
										name="middleName"
										labelCol={{
											span: 24,
										}}
										wrapperCol={{
											span: 24,
										}}
										hasFeedback
										rules={[
											{
												pattern: /^[a-zA-Z]*$/,
												message: "Middle name should have no number.",
											},
										]}
									>
										<Input placeholder="Enter your middle name" />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={12}>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item
										label="Last Name"
										name="lastName"
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
												message: "Please input your last name!",
											},
										]}
									>
										<Input placeholder="Enter your last name" />
									</Form.Item>
								</Col>

								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item
										label="Birth Date"
										name="birthdate"
										labelCol={{
											span: 24,
											//offset: 2
										}}
										wrapperCol={{
											span: 24,
										}}
										hasFeedback
										rules={[
											{
												required: true,
												message: "Please enter your birth date!",
											},
										]}
									>
										<DatePicker style={{ width: "100%" }} />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={0}>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<Form.Item
										label="Gender"
										name="gender"
										labelCol={{
											span: 24,
											//offset: 2
										}}
										wrapperCol={{
											span: 24,
										}}
										hasFeedback
										rules={[
											{
												required: true,
												message: "Please select your gender!",
											},
										]}
									>
										<Radio.Group style={{ width: "100%" }}>
											<Radio value="Male">Male</Radio>
											<Radio value="Female">Female</Radio>
										</Radio.Group>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={0}>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<Form.Item
										label="Upload ID (Validation of Account)"
										name="photo"
										labelCol={{
											span: 24,
											//offset: 2
										}}
										wrapperCol={{
											span: 24,
										}}
										hasFeedback
										rules={[
											{
												required: true,
												message: "Please upload an image",
											},
										]}
									>
										<Upload {...imgprops} listType="picture-card" maxCount={1} onPreview={onPreview}>
											<div>
												<PlusOutlined />
												<div style={{ marginTop: 8 }}>Upload</div>
											</div>
										</Upload>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={0}>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<Form.Item
										label="Email"
										name="email"
										labelCol={{
											span: 24,
											//offset: 2
										}}
										wrapperCol={{
											span: 24,
										}}
										hasFeedback
										rules={[
											{
												type: "email",
												required: true,
												message: "Please enter a valid email",
											},
										]}
									>
										<Input placeholder="Enter your email" />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={12}>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<Form.Item
										label="Address"
										name="address"
										labelCol={{
											span: 24,
											//offset: 2
										}}
										wrapperCol={{
											span: 24,
										}}
										hasFeedback
										rules={[
											{
												required: true,
												message: "Please enter your address!",
											},
										]}
									>
										<Input placeholder="Enter your House No./Street Name/Barangay" />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={12}>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<Form.Item
										label="Municipality"
										name="municipal"
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
												message: "Please select your Municipality!",
											},
										]}
									>
										<Select placeholder="Select your Municipality">
											{MunicipalData.map((value, index) => (
												<Select.Option key={index} value={value.name}>
													{value.label}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</Row>
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
										<Input.Password placeholder="********" />
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
										<Input.Password placeholder="********" />
									</Form.Item>
								</Col>
							</Row>
							<Button type="primary" htmlType="submit">
								Register
							</Button>
						</Col>
						<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
					</Row>
				</Form>
			) : null}
			{step2 ? (
				<>
					<Row gutter={12}>
						<Col xs={{ span: 24 }} md={{ span: 12 }}>
							<Typography fontSize="16px">Please check the 6 digits in your email</Typography>
						</Col>
						<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
						<Form
							name="basic"
							labelCol={{ span: 24 }}
							wrapperCol={{ span: 24 }}
							initialValues={{
								remember: true,
							}}
							onFinish={onStep2}
							onFinishFailed={onStep2Failed}
							autoComplete="off"
							className={classes.Form}
						>
							<Col xs={{ span: 24 }} md={{ span: 12 }}>
								<Form.Item
									label="6-digits code"
									name="code"
									rules={[
										{
											required: true,
											message: "Please input your code!",
										},

										{ min: 6 },
										{ max: 6 },
									]}
									hasFeedback
								>
									<Input placeholder="6-digits code" />
								</Form.Item>

								<Button type="primary" htmlType="submit">
									Submit
								</Button>
							</Col>
						</Form>
						<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
					</Row>
					<Button type="primary" onClick={sendOTP}>
						{sendButtonLabel}
					</Button>
				</>
			) : null}
		</>
	);
};

export default RegistrationForm;
