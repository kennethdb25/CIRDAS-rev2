import React, { useState, useContext, useEffect } from "react";
import { Button, Form, Input, Select, Row, Col, message, Typography } from "antd";
import { Box } from "@mui/material";
import "antd/dist/antd.min.css";
import { toast } from "react-toastify";
import { LoginContext } from "../../../../context/Context";
import { MunicipalData } from "../../../../data/CitizensData";
import useStyles from "../../../Login/CitizenContent/styles";

const { TextArea } = Input;

const ComplaintUpdateForm = (props) => {
	const { onClose, fetchData, updateData } = props;
	const [form] = Form.useForm();
	const { loginData } = useContext(LoginContext);
	const complainantname = `${loginData.validcitizen?.firstName} ${loginData.validcitizen?.lastName}`;
	const complainantid = `${loginData.validcitizen._id}`;
	console.log(updateData);
	const initialValues = {
		complainantname: complainantname,
		userId: complainantid,
		complaint: updateData?.complaint,
		contact: updateData?.contact,
		address: updateData?.address,
		municipal: updateData?.municipal,
		timeAndDate: updateData?.timeAndDate,
		victim: updateData?.victim,
		witness: updateData?.witness,
		suspect: updateData?.suspect,
		description: updateData?.description,
		complaintid: updateData?.complaintid,
	};

	const classes = useStyles();

	const onFinish = async (values) => {
		console.log(values);
		const data = await fetch(`/citizen/complaint/${updateData?.complaintid}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();
		if (res.status === 201) {
			toast.success("Updated Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
			onClose();
			fetchData();
			form.resetFields();
		} else {
			toast.error(res.error, { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
		}
	};

	const onFinishFailed = (errorInfo) => {
		message.error("Please input all the required details");
	};

	return (
		<Form
			form={form}
			labelCol={{
				span: 8,
			}}
			initialValues={initialValues}
			layout="horizontal"
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
			style={{
				width: "100%",
				maxHeight: "100vh",
			}}
		>
			<Row>
				<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
				<Col xs={{ span: 24 }} md={{ span: 16 }}>
					<Row gutter={12}>
						<Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
							<Form.Item
								label="Complainant Name"
								name="complainantname"
								labelCol={{
									span: 24,
								}}
								wrapperCol={{
									span: 24,
								}}
								hasFeedback
							>
								<Input placeholder="Enter your first name" disabled />
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<Form.Item
								label="What"
								name="complaint"
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
										message: "Please input your complaint!",
									},
									{
										pattern: /^[a-zA-Z_ ]*$/,
										message: "Complaint should have no number or special character.",
									},
								]}
							>
								<Input placeholder="Enter your complaint" />
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<Form.Item
								label="Contact Number"
								name="contact"
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
										message: "Please input your contact number!",
									},
									{
										pattern: /^[0-9]*$/,
										message: "Contact number should be number.",
									},
									{ max: 11 },
									{ min: 11 },
								]}
							>
								<Input placeholder="Enter your contact number" />
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<Form.Item
								label="Where"
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
										message: "Enter the crime address!",
									},
								]}
							>
								<Input placeholder="Enter the crime address (e.g house no./street name/barangay)" />
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
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
										message: "Please select your municipality",
									},
								]}
							>
								<Select placeholder="Select your municipality">
									{MunicipalData.map((value, index) => (
										<Select.Option key={index} value={value.name}>
											{value.label}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
							<Form.Item
								label="Time and Date"
								name="timeAndDate"
								labelCol={{
									span: 24,
								}}
								wrapperCol={{
									span: 24,
								}}
								hasFeedback
							>
								<Input disabled />
							</Form.Item>
						</Col>
						<Box className={classes.whoComplaint}>
							<Typography style={{ fontSize: "16px", fontWeight: "bold" }}>Who</Typography>
							<Row gutter={12}>
								<Col xs={{ span: 24 }} md={{ span: 8 }}>
									<Form.Item
										label="Victim Name"
										name="victim"
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
												message: "Please enter victim name!",
											},
											{
												pattern: /^[a-zA-Z._ ]*$/,
												message: "Victim name should be a letter",
											},
										]}
									>
										<Input placeholder="Enter victim name" />
									</Form.Item>
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 8 }}>
									<Form.Item
										label="Witness Name"
										name="witness"
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
												message: "Please enter witness name!",
											},
											{
												pattern: /^[a-zA-Z._ ]*$/,
												message: "Witness name should be a letter",
											},
										]}
									>
										<Input placeholder="Enter witness name" />
									</Form.Item>
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 8 }}>
									<Form.Item
										label="Suspect Name"
										name="suspect"
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
												message: "Please enter suspect name!",
											},
											{
												pattern: /^[a-zA-Z._ ]*$/,
												message: "Suspect name should be a letter",
											},
										]}
									>
										<Input placeholder="Enter suspect name" />
									</Form.Item>
								</Col>
							</Row>
						</Box>
					</Row>
					<Form.Item name="userId">
						<Input hidden />
					</Form.Item>
					<Row gutter={12}>
						<Col xs={{ span: 24 }} md={{ span: 24 }}>
							<Form.Item
								label="How"
								name="description"
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
										message: "Please enter how!",
									},
								]}
							>
								<TextArea
									showCount
									maxLength={300}
									style={{
										height: 120,
									}}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name="complaintid">
						<Input hidden />
					</Form.Item>
					<Button type="primary" htmlType="submit">
						Update Complaint
					</Button>
				</Col>
				<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
			</Row>
		</Form>
	);
};

export default ComplaintUpdateForm;
