/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components";
import { PlusCircleOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import "antd/dist/antd.min.css";
import { Button, Input, Space, Table, Modal, Typography, Drawer, Form, Select, message, Row, Col, Tag } from "antd";
import { getColumnSearchProps } from "../Services/Complaint/TableService";
import { LoginContext } from "../../../../context/Context";
import ComplaintForm from "./ComplaintForm";
import { MunicipalData } from "../../../../data/CitizensData";
import useStyles from "../../../Login/CitizenContent/styles";
import { toast } from "react-toastify";

const { TextArea } = Input;

export default function ComplaintTable(props) {
	const { fetchData, complaintData, loading } = props;
	const [updateData, setUpdateData] = useState(null);
	const searchInput = useRef(null);
	const { loginData, setLoginData } = useContext(LoginContext);
	const [visible, setVisible] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [viewData, setViewData] = useState(null);
	const [isView, setIsView] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [pagination, setPagination] = useState({
		defaultCurrent: 1,
		pageSize: 10,
		total: complaintData[0]?.body.length,
	});

	const complainantname = `${loginData.validcitizen?.firstName} ${loginData.validcitizen?.lastName}`;
	const complainantid = `${loginData.validcitizen?._id}`;
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
		const data = await fetch(`/citizen/complaint/${updateData?.complaintid}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();
		if (res.status === 201) {
			message.success("Updated Successfully");
			onClose();
			fetchData();
			form.resetFields();
		} else {
			message.error(res.error);
		}
	};

	const onFinishFailed = () => {
		message.error("Please input all the required details");
	};

	const [form] = Form.useForm();

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
	};

	const UpdateRecord = (record) => {
		setIsEdit(true);
		setVisible(true);
		setUpdateData(record);
	};

	const ViewRecord = (record) => {
		setIsView(true);
		setViewData(record);
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "complaintid",
			key: "complaintid",
			width: "15%",
			...getColumnSearchProps("complaintid", searchInput, setSearchText, setSearchedColumn, handleReset, searchedColumn, searchText),
		},
		{
			title: "Complainant Name",
			dataIndex: "complainantname",
			key: "complainantname",
			width: "30%",
			...getColumnSearchProps("complainantname", searchInput, setSearchText, setSearchedColumn, handleReset, searchedColumn, searchText),
		},
		{
			title: "What",
			dataIndex: "complaint",
			key: "complaint",
			width: "20%",
			...getColumnSearchProps("complaint", searchInput, setSearchText, setSearchedColumn, handleReset, searchedColumn, searchText),
		},
		{
			title: "Where",
			dataIndex: "address",
			key: "address",
			...getColumnSearchProps("address", searchInput, setSearchText, setSearchedColumn, handleReset, searchedColumn, searchText),
			width: "20%",
		},
		{
			title: "When",
			dataIndex: "timeAndDate",
			key: "timeAndDate",
			width: "30%",
		},
		{
			title: "Who(Suspect)",
			dataIndex: "suspect",
			key: "suspect",
			...getColumnSearchProps("suspect", searchInput, setSearchText, setSearchedColumn, handleReset, searchedColumn, searchText),
			width: "30%",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			width: "10%",
			render: (_, { status }) => {
				let color;
				if (status === "Reviewed") {
					color = "yellow";
				} else if (status === "UnderInvestigation") {
					color = "geekblue";
				} else if (status === "Pending") {
					color = "volcano";
				} else {
					color = "green";
				}
				return (
					<>
						<Tag color={color} key={status}>
							{status}
						</Tag>
					</>
				);
			},
		},
		{
			title: (
				<Button type="primary" shape="round" icon={<PlusCircleOutlined />} onClick={() => setVisible(true)}>
					FILE A COMPLAINT
				</Button>
			),
			dataIndex: "",
			key: "x",
			width: "10%",
			render: (record) => (
				<>
					<div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
						<EyeOutlined
							style={{ color: "green" }}
							onClick={() => {
								ViewRecord(record);
							}}
						/>
						{record.status === "Pending" ? (
							<EditOutlined
								style={{ color: "red" }}
								onClick={() => {
									UpdateRecord(record);
									setTimeout(() => {
										form.resetFields();
									}, 10);
								}}
							/>
						) : (
							<></>
						)}
					</div>
				</>
			),
		},
	];

	const onClose = () => {
		setVisible(false);
		form.resetFields();
	};
	useEffect(() => {
		fetchData();
		form.resetFields();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Section>
			<div className="table">
				<Table columns={columns} dataSource={complaintData[0]?.body} pagination={pagination} loading={loading} />
			</div>
			<Drawer
				title={isEdit ? "UPDATE COMPLAINT" : "FILE A COMPLAINT"}
				placement="right"
				width="100%"
				onClose={onClose}
				open={visible}
				height={650}
				style={{
					display: "flex",
					justifyContent: "center",
				}}
				extra={<Space></Space>}
			>
				{isEdit ? (
					<>
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
					</>
				) : (
					<>
						<ComplaintForm onClose={onClose} fetchData={fetchData} />
					</>
				)}
			</Drawer>
			<Modal
				title="Complaint Details"
				open={isView}
				onCancel={() => setIsView(false)}
				footer={[
					<Button key="cancel" onClick={() => setIsView(false)}>
						Close
					</Button>,
				]}
			>
				<Typography>Complainant</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.complainantname} disabled />
				<Typography>Complaint</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.complaint} disabled />
				<Typography>Address</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.address} disabled />
				<Typography>Municipality</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.municipal} disabled />
				<Typography>Time and Date</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.timeAndDate} disabled />
				<Typography>Witness</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.witness} disabled />
				<Typography>Victim</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.victim} disabled />
				<Typography>Suspect</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.suspect} disabled />
				<Typography>Status</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.status} disabled />
				<Typography>How</Typography>
				<TextArea value={viewData?.description} showCount autoSize="false" maxLength={500} style={{ marginBottom: "15px" }} disabled />
				{viewData?.status === "Solved" ? (
					<>
						<Typography>Resolution</Typography>
						<TextArea value={viewData?.description} showCount autoSize="false" maxLength={500} style={{ marginBottom: "15px" }} disabled />
					</>
				) : (
					<></>
				)}
			</Modal>
		</Section>
	);
}

const Section = styled.section`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 20rem;
	modal: {
		input: {
			color: None;
		}
	}

	@media screen and (min-width: 280px) and (max-width: 1080px) {
		.table {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 310px;
			.ant-table-wrapper {
				display: Grid;
				grid-template-columns: 1fr;
				right: -100vw;
				overflow-x: auto;
				width: 100%;
			}
		}
	}
`;
