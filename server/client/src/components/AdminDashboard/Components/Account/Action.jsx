import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, Space, Modal, Form, Input, Row, Col, Button, message, Select } from "antd";
import { DeleteOutlined, LockOutlined, SyncOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { MunicipalData } from "../../../../data/CitizensData";

export default function Action(props) {
	const [visible, setVisible] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [isChangePassowrd, setIsChangePassword] = useState(false);

	const [form] = Form.useForm();
	const history = useNavigate();
	const { loginData, ValidUser } = props;

	const initialValues = {
		role: loginData.validadmin?.role,
		firstName: loginData.validadmin?.firstName,
		middleName: loginData.validadmin?.middleName ? loginData.validadmin?.middleName : "N/A",
		lastName: loginData.validadmin?.lastName,
		dob: new Date(loginData.validadmin?.dob).toLocaleDateString(),
		gender: loginData.validadmin?.gender,
		email: loginData.validadmin?.email,
		address: loginData.validadmin?.address,
		municipal: loginData.validadmin?.municipal,
	};

	const email = loginData.validadmin?.email;

	const onChangePassword = async (values) => {
		const data = await fetch(`/admin/change-password/${email}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();

		if (res.status === 201) {
			form.resetFields();
			message.success("Password Change Successfully");
			setIsChangePassword(false);
		} else {
			message.error(res.error);
		}
	};

	const onFinish = async (values) => {
		const data = await fetch(`/admin/update/${loginData.validadmin?.adminId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();
		if (res.status === 201) {
			ValidUser();
			message.success("Updated Succesfully");
			setVisible(false);
		} else {
			message.error(res.error);
		}
	};

	const onFinishFailed = (error) => {
		message.error(error);
	};

	useEffect(() => {
		ValidUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onChangePasswordFailed = async (error) => {
		console.log(error);
	};

	const onDeleteAccount = async () => {
		console.log("Deleting Account");
		const data = await fetch(`/admin/delete/${email}`, {
			method: "PATCH",
		});

		const res = await data.json();
		if (res.status === 201) {
			message.success("Deleted Successfully");
			setIsDelete(false);
			setTimeout(async () => {
				let token = localStorage.getItem("adminUserDataToken");

				const res = await fetch("/admin/logout", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: token,
						Accept: "application/json",
					},
					credentials: "include",
				});

				const dataPol = await res.json();

				if (dataPol.status === 201) {
					message.warning("Logging Out");
					setTimeout(() => {
						localStorage.removeItem("adminUserDataToken");
						history("/user-admin");
					}, 4000);
				} else {
					message.error("Error Occured");
				}
			}, 2000);
		} else {
			message.error(res.error);
		}
	};

	const onClose = () => {
		setVisible(false);
	};

	return (
		<Section>
			<div className="analytic ">
				<div className="content">
					<Button
						type="primary"
						icon={<SyncOutlined />}
						shape="round"
						onClick={() => {
							form.resetFields();
							ValidUser();
							setVisible(true);
						}}
					>
						UPDATE ACCOUNT DETAILS
					</Button>
				</div>
			</div>
			<div className="analytic">
				<div className="content">
					<Button type="primary" icon={<LockOutlined />} shape="round" onClick={() => setIsChangePassword(true)}>
						CHANGE PASSWORD
					</Button>
				</div>
			</div>
			<div className="analytic">
				<div className="content">
					<Button type="primary" icon={<DeleteOutlined />} danger shape="round" onClick={() => setIsDelete(true)}>
						DELETE ACCOUNT
					</Button>
				</div>
			</div>
			<Drawer
				title="UPDATE ACCOUNT DETAILS"
				placement="right"
				width="100%"
				onClose={onClose}
				open={visible}
				height={630}
				style={{
					display: "flex",
					justifyContent: "center",
				}}
				extra={<Space></Space>}
			>
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
										<Input placeholder="Enter your first name" disabled />
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
										<Input placeholder="Enter your middle name" disabled />
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
										<Input placeholder="Enter your last name" disabled />
									</Form.Item>
								</Col>

								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item
										label="Birth Date"
										name="dob"
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
										<Input disabled />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={12}>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
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
										<Input disabled />
									</Form.Item>
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<Form.Item
										label="Role"
										name="role"
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
												message: "Please enter you role",
											},
										]}
									>
										<Input placeholder="Enter your role" disabled />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={12}>
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
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
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
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
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
							<Button type="primary" htmlType="submit">
								Update Profile
							</Button>
						</Col>
						<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
					</Row>
				</Form>
			</Drawer>
			<Modal
				title="Action"
				width={400}
				open={isDelete}
				onCancel={() => setIsDelete(false)}
				footer={[
					<Button key="back" onClick={() => setIsDelete(false)}>
						CANCEL
					</Button>,
					<Button key="submit" type="danger" onClick={onDeleteAccount}>
						DELETE
					</Button>,
				]}
			>
				Are you sure to "DELETE" this account?
			</Modal>

			<Modal
				title="CHANGE PASSWORD"
				width={700}
				open={isChangePassowrd}
				onCancel={() => {
					setIsChangePassword(false);
					form.resetFields();
				}}
				footer={[
					<Button
						key="back"
						onClick={() => {
							setIsChangePassword(false);
							form.resetFields();
						}}
					>
						CANCEL
					</Button>,
				]}
			>
				<div>
					<Form
						name="basic"
						form={form}
						labelCol={{ span: 24 }}
						wrapperCol={{ span: 24 }}
						initialValues={{
							remember: true,
						}}
						onFinish={onChangePassword}
						onFinishFailed={onChangePasswordFailed}
						autoComplete="off"
					>
						<Row gutter={12}>
							<Col xs={{ span: 24 }} md={{ span: 8 }}>
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
							<Col xs={{ span: 24 }} md={{ span: 8 }}>
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
							<Col xs={{ span: 24 }} md={{ span: 8 }}></Col>
							<Button type="primary" htmlType="submit">
								CHANGE
							</Button>
						</Row>
					</Form>
				</div>
			</Modal>
		</Section>
	);
}
const Section = styled.section`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	grid-template-columns: 1fr
	margin-top: 2rem;
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
