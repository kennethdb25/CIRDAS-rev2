import React, { useContext } from "react";
import { Button, Form, Input, Select, Row, Col, message, Typography } from "antd";
import { Box } from "@mui/material";
import "antd/dist/antd.min.css";
import { toast } from "react-toastify";
import { LoginContext } from "../../../../context/Context";
import { MunicipalData } from "../../../../data/CitizensData";
import useStyles from "../../../Login/CitizenContent/styles";
import { sendNotification } from "../Services/Complaint/SendNotifcation";

const { TextArea } = Input;

const ComplaintForm = (props) => {
	const [form] = Form.useForm();
	const { loginData } = useContext(LoginContext);
	const complainantname = `${loginData.validcitizen?.firstName} ${loginData.validcitizen?.lastName}`;
	const complainantid = `${loginData.validcitizen._id}`;
	const timeAndDate = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

	const classes = useStyles();

	const { onClose, fetchData } = props;

	const onFinish = async (values) => {
		const data = await fetch("/citizen/complaint", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();
		if (res.status === 201) {
			toast.success("Filed Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
			fetchData();
			sendNotification(values.municipal, values.complainantname, values.complaint);
			form.resetFields();
			onClose();
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
			initialValues={{ complainantname: complainantname, userId: complainantid, timeAndDate: timeAndDate }}
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
								<Input placeholder="Enter your first name" defaultValue={complainantname} disabled />
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
								<Input defaultValue={timeAndDate} disabled />
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
										]}
									>
										<Input placeholder="Enter suspect name" />
									</Form.Item>
								</Col>
							</Row>
						</Box>
					</Row>
					<Form.Item name="userId">
						<Input hidden defaultValue={complainantid} />
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
									{
										pattern: /^[a-zA-Z_ ]*$/,
										message: "How should be a letter",
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
					<Button type="primary" htmlType="submit">
						File Complaint
					</Button>
					<Form.Item>
						<Input hidden />
					</Form.Item>
				</Col>
				<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
			</Row>
		</Form>
	);
};

export default ComplaintForm;
