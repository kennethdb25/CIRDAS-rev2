import React, { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components";
import { PlusCircleOutlined, SearchOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Modal, Typography, Select, Form, message, Drawer, Row, Col, Tag } from "antd";
import { Box } from "@mui/material";
import { MunicipalData } from "../../../../data/CitizensData";
import { LoginContext } from "../../../../context/Context";
import ComplaintForm from "./ComplaintForm";
import { AdminComplaintStatus } from "../../../../data/AdminData";
import useStyles from "../../../Login/CitizenContent/styles";

const { TextArea } = Input;

export default function ComplaintTable(props) {
	const { getFiledComplaint, getPendingComplaints, getReviewedComplaints, getUnderInvestigation } = props;
	const [checkRecord, setCheckRecord] = useState(null);
	const [recordData, setRecordData] = useState(null);
	const [updateData, setUpdateData] = useState(null);
	const [data, setData] = useState([]);
	const [status, setStatus] = useState(true);
	const searchInput = useRef(null);
	const { loginData } = useContext(LoginContext);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [viewData, setViewData] = useState(null);
	const [isView, setIsView] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [reso, setReso] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [pagination, setPagination] = useState({
		defaultCurrent: 1,
		pageSize: 6,
		total: data[0]?.body.length,
	});

	const complainantname = `${loginData.validcitizen?.firstName} ${loginData.validcitizen?.lastName}`;
	const complainantid = `${loginData.validcitizen?._id}`;
	const initialValuesUpdate = {
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

	const handleStatusResolved = (values) => {
		if (values === "Solved") {
			setReso(true);
		} else {
			setReso(false);
		}
	};

	const classes = useStyles();

	const onFinishUpdate = async (values) => {
		const data = await fetch(`/citizen/complaint/${updateData?.complaintid}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();
		if (res.status === 201) {
			message.success("Complaint Updated Successfully");
			onClose();
			fetchData();
			form.resetFields();
		} else {
			message.error(res.error);
		}
	};

	const onFinishUpdateFailed = () => {
		message.error("Please input all the required details");
	};

	const [form] = Form.useForm();

	const fetchData = async () => {
		setLoading(true);
		const res = await fetch(`/citizen/complaint`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const dataComp = await res.json();
		setData([dataComp]);
		setLoading(false);
	};

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
	};

	const UpdateRecord = (record) => {
		setIsEdit(true);
		setVisible(true);
		setUpdateData(record);
	};

	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div
				style={{
					padding: 8,
				}}
			>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{
						marginBottom: 8,
						display: "block",
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{
							width: 90,
						}}
					>
						Search
					</Button>
					<Button
						onClick={() => clearFilters && handleReset(clearFilters)}
						size="small"
						style={{
							width: 90,
						}}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({
								closeDropdown: false,
							});
							setSearchText(selectedKeys[0]);
							setSearchedColumn(dataIndex);
						}}
					>
						Filter
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{
					color: filtered ? "#1890ff" : undefined,
				}}
			/>
		),
		onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{
						backgroundColor: "#ffc069",
						padding: 0,
					}}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ""}
				/>
			) : (
				text
			),
	});

	const ViewRecord = (record) => {
		console.log(record);
		setIsView(true);
		setViewData(record);
	};

	const CheckRecord = (record) => {
		setCheckRecord(true);
		setRecordData(record);
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "complaintid",
			key: "complaintid",
			width: "10%",
			...getColumnSearchProps("complaintid"),
		},
		{
			title: "Complainant Name",
			dataIndex: "complainantname",
			key: "complainantname",
			width: "30%",
			...getColumnSearchProps("complainantname"),
		},
		{
			title: "What",
			dataIndex: "complaint",
			key: "complaint",
			width: "20%",
			...getColumnSearchProps("complaint"),
		},
		{
			title: "Where",
			dataIndex: "address",
			key: "address",
			...getColumnSearchProps("address"),
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
			...getColumnSearchProps("suspect"),
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
					{record.status !== "Solved" ? (
						<div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
							<EyeOutlined
								style={{ color: "green" }}
								onClick={() => {
									ViewRecord(record);
									setTimeout(() => {
										form.resetFields();
									}, 10);
								}}
							/>
							<EditOutlined
								style={{ color: "red" }}
								onClick={() => {
									UpdateRecord(record);
									setTimeout(() => {
										form.resetFields();
									}, 10);
								}}
							/>
						</div>
					) : (
						<div style={{ display: "flex", justifyContent: "center" }}>
							<EyeOutlined
								style={{ color: "blue" }}
								onClick={() => {
									CheckRecord(record);
								}}
							/>
						</div>
					)}
				</>
			),
		},
	];

	const initialValues = {
		status: viewData?.status,
		resolution: viewData?.resolution,
	};

	const enableStatus = () => {
		setStatus(false);
	};

	const onClearForms = () => {
		setIsView(false);
		setCheckRecord(false);
		setStatus(true);
	};

	const onFinish = async (values) => {
		const data = await fetch(`/admin/complaint-update/${viewData?._id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();
		if (res.status === 201) {
			message.success("Complaint Status Updated Successfully");
			form.resetFields();
			getFiledComplaint();
			getPendingComplaints();
			getReviewedComplaints();
			getUnderInvestigation();
			fetchData();
			onClearForms();
		} else {
			message.error(res.error);
		}
	};

	const onClose = () => {
		setVisible(false);
		form.resetFields();
	};

	const onFinishFailed = async (error) => {
		message.error(error);
	};

	useEffect(() => {
		fetchData();
		form.resetFields();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Section>
			<div className="table">
				<Table columns={columns} dataSource={data[0]?.body} pagination={pagination} loading={loading} />
			</div>
			<div className="drawe">
				<Drawer
					title={isEdit ? "UPDATE A COMPLAINT" : "FILE A COMPLAINT"}
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
								initialValues={initialValuesUpdate}
								layout="horizontal"
								onFinish={onFinishUpdate}
								onFinishFailed={onFinishUpdateFailed}
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
							<ComplaintForm
								onClose={onClose}
								fetchData={fetchData}
								getFiledComplaint={getFiledComplaint}
								getPendingComplaints={getPendingComplaints}
								getReviewedComplaints={getReviewedComplaints}
								getUnderInvestigation={getUnderInvestigation}
							/>
						</>
					)}
				</Drawer>
			</div>
			<div className="modal">
				<Modal
					title="Complaint Details"
					open={isView}
					onCancel={() => {
						onClearForms();
					}}
					footer={[
						<Button
							key="cancel"
							onClick={() => {
								onClearForms();
							}}
						>
							Cancel
						</Button>,
						<>
							{status ? (
								<Button type="primary" key="updatestatus" onClick={enableStatus}>
									Update Status
								</Button>
							) : (
								<></>
							)}
							,
						</>,
					]}
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
							maxHeight: "100vh",
						}}
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
						<Typography>How</Typography>
						<TextArea value={viewData?.description} showCount autoSize="false" maxLength={500} style={{ marginBottom: "15px" }} disabled />
						<Form.Item
							label="Status"
							name="status"
							labelCol={{
								span: 24,
								//offset: 2
							}}
							wrapperCol={{
								span: 24,
							}}
							hasFeedback
						>
							{status ? (
								<Input disabled={status} />
							) : (
								<Select style={{ width: "100%" }} onChange={handleStatusResolved} disabled={status}>
									{AdminComplaintStatus.map((value, index) => (
										<Select.Option key={index} value={value.name}>
											{value.label}
										</Select.Option>
									))}
								</Select>
							)}
						</Form.Item>

						{reso ? (
							<>
								<Form.Item
									label="Resolution"
									name="resolution"
									labelCol={{
										span: 24,
										//offset: 2
									}}
									wrapperCol={{
										span: 24,
									}}
									hasFeedback
								>
									<Input placeholder="Enter Resolution" disabled={status} />
								</Form.Item>
							</>
						) : (
							<></>
						)}

						{status ? (
							<></>
						) : (
							<>
								<Button type="primary" htmlType="submit">
									Update
								</Button>
							</>
						)}
					</Form>
				</Modal>

				<Modal
					title="Complaint Details"
					open={checkRecord}
					onCancel={() => {
						onClearForms();
					}}
					footer={[
						<Button
							key="cancel"
							onClick={() => {
								onClearForms();
							}}
						>
							Close
						</Button>,
					]}
				>
					<Typography>Complainant</Typography>
					<Input style={{ marginBottom: "15px" }} value={recordData?.complainantname} disabled />
					<Typography>Complaint</Typography>
					<Input style={{ marginBottom: "15px" }} value={recordData?.complaint} disabled />
					<Typography>Address</Typography>
					<Input style={{ marginBottom: "15px" }} value={recordData?.address} disabled />
					<Typography>Municipality</Typography>
					<Input style={{ marginBottom: "15px" }} value={recordData?.municipal} disabled />
					<Typography>Time and Date</Typography>
					<Input style={{ marginBottom: "15px" }} value={recordData?.timeAndDate} disabled />
					<Typography>Witness</Typography>
					<Input style={{ marginBottom: "15px" }} value={recordData?.witness} disabled />
					<Typography>Victim</Typography>
					<Input style={{ marginBottom: "15px" }} value={recordData?.victim} disabled />
					<Typography>Suspect</Typography>
					<Input style={{ marginBottom: "15px" }} value={recordData?.suspect} disabled />
					<Typography>Status</Typography>
					<Input style={{ marginBottom: "15px" }} value={recordData?.status} disabled />
					<Typography>Resolution</Typography>
					<Input style={{ marginBottom: "15px" }} value={recordData?.resolution} disabled />
					<Typography>How</Typography>
					<TextArea value={recordData?.description} showCount autoSize="false" maxLength={500} style={{ marginBottom: "15px" }} disabled />
				</Modal>
			</div>
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
