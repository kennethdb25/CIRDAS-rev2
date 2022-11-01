import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, Space, Modal, Form, Input, Row, Col, Button, Image } from "antd";
import { DeleteOutlined, FileImageOutlined, LockOutlined, SyncOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { toast } from "react-toastify";
import { LoginContext } from "../../../../context/Context";

export default function Action() {
	const [img, setImg] = useState();
	const [uploadParam, setUploadParam] = useState();
	const [visible, setVisible] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [isUploaded, setIsUploaded] = useState(false);
	const [isChangePassowrd, setIsChangePassword] = useState(false);

	const [form] = Form.useForm();
	const history = useNavigate();
	const { loginData } = useContext(LoginContext);

	const email = loginData.validcitizen?.email;

	const onChangePassword = async (values) => {
		const data = await fetch(`/citizen/change-password/${email}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();

		if (res.status === 201) {
			form.resetFields();
			toast.success("Password Change Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
			setIsChangePassword(false);
		} else {
			toast.error(res.error, { position: toast.POSITION.TOP_CENTER });
		}
	};

	useEffect(() => {
		fetch(`/uploads/${uploadParam}`)
			.then((res) => res.blob())
			.then(
				(result) => {
					setImg(URL.createObjectURL(result));
					console.log(URL.createObjectURL(result));
				},
				(error) => {
					console.log(error);
				}
			);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [uploadParam]);

	const onUploaded = () => {
		setUploadParam(loginData?.validcitizen?.imgpath);
		setIsUploaded(true);
	};

	const onChangePasswordFailed = async (error) => {
		console.log(error);
	};

	const onDeleteAccount = async () => {
		console.log("Deleting Account");
		const data = await fetch(`/citizen/delete/${email}`, {
			method: "PATCH",
		});

		const res = await data.json();
		if (res.status === 201) {
			toast.success("Deleted Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
			setIsDelete(false);
			setTimeout(async () => {
				let token = localStorage.getItem("citizenUserDataToken");

				const res = await fetch("/citizen/logout", {
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
					toast.warn("Logging Out", { position: toast.POSITION.TOP_CENTER });
					setTimeout(() => {
						localStorage.removeItem("citizenUserDataToken");
						history("/");
					}, 4000);
				} else {
					toast.error("Error Occured", { position: toast.POSITION.TOP_CENTER });
				}
			}, 2000);
		} else {
			toast.error(res.error, { position: toast.POSITION.TOP_CENTER });
		}
	};

	const onClose = () => {
		setVisible(false);
	};

	return (
		<Section>
			<div className="analytic ">
				<div className="content">
					<Button type="primary" icon={<SyncOutlined />} shape="round" onClick={() => setVisible(true)}>
						UPDATE ACCOUNT DETAILS
					</Button>
				</div>
			</div>
			<div className="analytic">
				<div className="content">
					<Button type="primary" icon={<FileImageOutlined />} shape="round" onClick={() => onUploaded()}>
						UPLOADED DOCUMENT
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
				title="UPLOADED DOCUMENT"
				width={600}
				open={isUploaded}
				onCancel={() => {
					setIsUploaded(false);
				}}
				footer={[
					<Button key="back" onClick={() => setIsUploaded(false)}>
						CLOSE
					</Button>,
				]}
			>
				<Col xs={{ span: 24 }} md={{ span: 24 }}>
					<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
						<Image style={{ border: "1px solid black" }} height={300} weight={300} src={img} alt="view" />
					</div>
				</Col>
			</Modal>
			<Modal
				title="CHANGE PASSWORD"
				width={700}
				open={isChangePassowrd}
				onCancel={() => setIsChangePassword(false)}
				footer={[
					<Button key="back" onClick={() => setIsChangePassword(false)}>
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
	display: grid;
	grid-template-columns: 1fr
	margin-top: 2.1rem;
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
