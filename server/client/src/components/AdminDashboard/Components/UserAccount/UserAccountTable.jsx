import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { SearchOutlined, PlusCircleOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import emailjs from "@emailjs/browser";
import { MunicipalData } from "../../../../data/CitizensData";
import { AdminRole } from "../../../../data/AdminData";
import { Button, Input, Space, Table, Modal, message, Select, DatePicker, Typography, Drawer, Form, Row, Col, Image, Radio, Tabs } from "antd";
const { Text } = Typography;

export default function UserAccountTable() {
	const [img, setImg] = useState();
	const [getCitizen, setGetCitizen] = useState([]);
	const [getPolice, setGetPolice] = useState([]);
	const [getAdmin, setGetAdmin] = useState([]);
	const [validationData, setValidationData] = useState(null);
	const [isReview, setIsReview] = useState(false);
	const [showPoliceForm, setShowPoliceForm] = useState(false);
	const [showAdminForm, setShowAdminForm] = useState(false);
	const [isValidated, setIsValidated] = useState(false);
	const [searchedColumn, setSearchedColumn] = useState("");
	const [searchText, setSearchText] = useState("");
	const searchInput = useRef(null);
	const [loading, setLoading] = useState(false);
	const [filteredInfo, setFilteredInfo] = useState({});
	const [pagination, setPagination] = useState({
		defaultCurrent: 1,
		pageSize: 10,
		total: getCitizen[0]?.body.length,
	});

	useEffect(() => {
		getCitizenUsers();
		getPoliceUsers();
		getAdminUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// API CALL
	const getCitizenUsers = async () => {
		setLoading(true);
		const data = await fetch("/citizen/users", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const res = await data.json();
		setGetCitizen([res]);
		setLoading(false);
	};

	const getPoliceUsers = async () => {
		setLoading(true);
		const data = await fetch("/police/users", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const res = await data.json();
		setGetPolice([res]);
		setLoading(false);
	};

	const getAdminUsers = async () => {
		setLoading(true);
		const data = await fetch("/admin/users", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const res = await data.json();
		setGetAdmin([res]);
		setLoading(false);
	};

	// get image

	// const fetchImage = async () => {
	// 	const res = await fetch(`/uploads/${validationData?.imgpath}`);
	// 	console.log(res);
	// 	const imageBlob = await res.blob();
	// 	const imageObjectUrl = URL.createObjectURL(imageBlob);
	// 	setImg(imageObjectUrl);
	// 	console.log(imageObjectUrl);
	// };

	useEffect(() => {
		if (validationData) {
			fetch(`/uploads/${validationData?.imgpath}`)
				.then((res) => res.blob())
				.then(
					(result) => {
						setImg(URL.createObjectURL(result));
					},
					(error) => {
						console.log(error);
					}
				);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validationData]);

	// ---------- END API CALL ------------

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
	};

	const handleChange = (pagination, filters, sorter) => {
		console.log("Various parameters", pagination, filters, sorter);
		setFilteredInfo(filters);
	};

	const onViewRecord = (record) => {
		setIsReview(true);
		setValidationData(record);
	};

	const onValidateRecord = async (record) => {
		setValidationData(record);
		setIsValidated(true);
	};

	const ValidationOfRecord = async (email) => {
		console.log(email);
		const data = await fetch(`/citizen/users/${email}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const res = await data.json();
		if (res.status === 201) {
			emailjs.send(
				"service_l73uecp",
				"template_9nf8brc",
				{
					firstName: validationData?.firstName,
					email: email,
				},
				"DMcuBIZy8OD0MT29W"
			);
			setLoading(true);
			message.success("Validation Completed");
			setIsValidated(false);
			getCitizenUsers();
			setLoading(false);
		}
	};

	const RejectionOfRecord = async (email) => {
		console.log(email);
		const data = await fetch(`/citizen/users/${email}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const res = await data.json();
		if (res.status === 201) {
			emailjs.send(
				"service_l73uecp",
				"template_a0qa0yb",
				{
					firstName: validationData?.firstName,
					email: email,
				},
				"DMcuBIZy8OD0MT29W"
			);
			setLoading(true);
			message.success("Rejection Completed");
			setIsValidated(false);
			getCitizenUsers();
			setLoading(false);
		}
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

	const AdminColumn = [
		{
			title: "ID",
			dataIndex: "adminId",
			key: "adminId",
			width: "15%",
			...getColumnSearchProps("adminId"),
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			width: "20%",
			...getColumnSearchProps("email"),
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
			width: "10%",
		},
		{
			title: "First Name",
			dataIndex: "firstName",
			key: "firstName",
			width: "10%",
		},
		{
			title: "Last Name",
			dataIndex: "lastName",
			key: "lastName",
			width: "10%",
		},
		{
			title: (
				<Button type="primary" shape="round" icon={<PlusCircleOutlined />} onClick={() => setShowAdminForm(true)}>
					Add Admin User
				</Button>
			),
			dataIndex: "",
			key: "x",
			width: "10%",
			render: (record) => (
				<>
					<div style={{ display: "flex" }}>
						<Button
							type="primary"
							shape="round"
							icon={<EyeOutlined />}
							onClick={() => {
								onViewPoliceRecord(record);
							}}
						>
							Review
						</Button>
					</div>
				</>
			),
		},
	];

	const CitizenColumn = [
		{
			title: "ID",
			dataIndex: "citizenId",
			key: "citizenId",
			width: "15%",
			...getColumnSearchProps("citizenId"),
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			width: "20%",
			...getColumnSearchProps("email"),
		},
		{
			title: "First Name",
			dataIndex: "firstName",
			key: "firstName",
			width: "10%",
		},
		{
			title: "Last Name",
			dataIndex: "lastName",
			key: "lastName",
			width: "10%",
		},
		{
			title: "Municipal",
			dataIndex: "municipal",
			key: "municipal",
			width: "10%",
		},
		{
			title: "Status",
			dataIndex: "accountstatus",
			key: "accountstatus",
			width: "10%",
		},
		{
			title: "",
			dataIndex: "",
			key: "x",
			width: "10%",
			render: (record) => (
				<>
					<div style={{ display: "flex" }}>
						<Button
							type={record?.accountstatus === "Pending" ? "danger" : "primary"}
							shape="round"
							icon={record?.accountstatus === "Pending" ? <EditOutlined /> : <EyeOutlined />}
							onClick={() => {
								record?.accountstatus === "Pending" ? onValidateRecord(record) : onViewRecord(record);
							}}
						>
							{record?.accountstatus === "Pending" ? "Validate" : "Review"}
						</Button>
					</div>
				</>
			),
		},
	];

	// Police User

	const [form] = Form.useForm();

	const onViewPoliceRecord = (record) => {
		console.log(record);
	};

	const onClose = () => {
		setShowPoliceForm(false);
		setShowAdminForm(false);
		form.resetFields();
	};

	const onSubmitPoliceForm = async (values) => {
		const data = await fetch("/police/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();
		if (res.status === 201) {
			message.success("Registered Successfully");
			onClose();
			getPoliceUsers();
			form.resetFields();
		} else {
			message.error(res.error);
		}
	};

	const onSubmitPoliceFormFailed = async (error) => {
		console.log(error);
	};

	const onSubmitAdminForm = async (values) => {
		console.log(values);
		const data = await fetch("/admin/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();
		if (res.status === 201) {
			message.success("Registered Successfully");
			onClose();
			getAdminUsers();
			form.resetFields();
		} else {
			message.error(res.error);
		}
	};

	const onSubmitAdminFormFailed = async (error) => {
		console.log(error);
	};

	const PoliceColumn = [
		{
			title: "ID",
			dataIndex: "policeId",
			key: "policeId",
			width: "15%",
			...getColumnSearchProps("policeId"),
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			width: "20%",
			...getColumnSearchProps("email"),
		},
		{
			title: "Rank",
			dataIndex: "rank",
			key: "rank",
			width: "10%",
		},
		{
			title: "First Name",
			dataIndex: "firstName",
			key: "firstName",
			width: "10%",
		},
		{
			title: "Last Name",
			dataIndex: "lastName",
			key: "lastName",
			width: "10%",
		},
		{
			title: "Municipal",
			dataIndex: "municipal",
			key: "municipal",
			width: "10%",
		},

		{
			title: (
				<Button type="primary" shape="round" icon={<PlusCircleOutlined />} onClick={() => setShowPoliceForm(true)}>
					Add Police User
				</Button>
			),
			dataIndex: "",
			key: "x",
			width: "10%",
			render: (record) => (
				<>
					<div style={{ display: "flex" }}>
						<Button
							type="primary"
							shape="round"
							icon={<EyeOutlined />}
							onClick={() => {
								onViewPoliceRecord(record);
							}}
						>
							Review
						</Button>
					</div>
				</>
			),
		},
	];
	return (
		<Section>
			<Tabs>
				<Tabs.TabPane tab="CITIZEN USERS" key="key1">
					<div className="table">
						<Table columns={CitizenColumn} dataSource={getCitizen[0]?.body} pagination={pagination} loading={loading} onChange={handleChange} />
					</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab="POLICE USERS" key="key2">
					<div className="table">
						<Table columns={PoliceColumn} dataSource={getPolice[0]?.body} pagination={pagination} loading={loading} onChange={handleChange} />
					</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab="ADMIN USERS" key="key3">
					<Table columns={AdminColumn} dataSource={getAdmin[0]?.body} pagination={pagination} loading={loading} onChange={handleChange} />
				</Tabs.TabPane>
			</Tabs>

			<div className="drawer">
				<Drawer
					title="Police User Registration"
					placement="right"
					width="100%"
					onClose={onClose}
					open={showPoliceForm}
					height={670}
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
						layout="horizontal"
						onFinish={onSubmitPoliceForm}
						onFinishFailed={onSubmitPoliceFormFailed}
						autoComplete="off"
						style={{
							width: "100%",
						}}
					>
						<Row>
							<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
							<Col xs={{ span: 24 }} md={{ span: 16 }}>
								<Row gutter={12}>
									<Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
										<Form.Item
											label="Rank"
											name="rank"
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
													message: "Please input your rank!",
												},
											]}
										>
											<Input placeholder="Enter your rank" />
										</Form.Item>
									</Col>
									<Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
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
									<Col xs={{ span: 24 }} md={{ span: 8 }}>
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
									<Col xs={{ span: 24 }} md={{ span: 8 }}>
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
									<Col xs={{ span: 24 }} md={{ span: 16 }}>
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
									<Col xs={{ span: 24 }} md={{ span: 16 }}>
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
				</Drawer>

				<Drawer
					title="Admin User Registration"
					placement="right"
					width="100%"
					onClose={onClose}
					open={showAdminForm}
					height={670}
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
						layout="horizontal"
						onFinish={onSubmitAdminForm}
						onFinishFailed={onSubmitAdminFormFailed}
						autoComplete="off"
						style={{
							width: "100%",
						}}
					>
						<Row>
							<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
							<Col xs={{ span: 24 }} md={{ span: 16 }}>
								<Row gutter={12}>
									<Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
										<Form.Item
											label="Role"
											name="role"
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
													message: "Please input your role!",
												},
											]}
										>
											<Select placeholder="Select your role">
												{AdminRole.map((value, index) => (
													<Select.Option key={index} value={value.name}>
														{value.label}
													</Select.Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									<Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
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
									<Col xs={{ span: 24 }} md={{ span: 8 }}>
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
											<DatePicker style={{ width: "100%" }} />
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={0}>
									<Col xs={{ span: 24 }} md={{ span: 8 }}>
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
									<Col xs={{ span: 24 }} md={{ span: 16 }}>
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
									<Col xs={{ span: 24 }} md={{ span: 16 }}>
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
				</Drawer>
			</div>

			<div className="modals">
				<Modal
					title="Review Citizen User"
					width={1000}
					open={isReview}
					onCancel={() => setIsReview(false)}
					footer={[
						<Button key="cancel1" onClick={() => setIsReview(false)}>
							Cancel
						</Button>,
					]}
				>
					<Row gutter={12}>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Citizen ID:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.citizenId} disabled />
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Email Address:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.email} disabled />
						</Col>
					</Row>
					<Row gutter={12}>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>First Name:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.firstName} disabled />
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Middle Name:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.middleName === "undefined" ? "N/A" : validationData?.middleName} disabled />
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Last Name:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.lastName} disabled />
						</Col>
					</Row>
					<Row gutter={12}>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Gender:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.gender} disabled />
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Date of Birth:</Text>
							<Input style={{ marginBottom: "8px" }} value={new Date(validationData?.birthdate).toDateString()} disabled />
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Account Status:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.accountstatus} disabled />
						</Col>
					</Row>
					<Row gutter={12}>
						<Col xs={{ span: 24 }} md={{ span: 16 }}>
							<br></br>
							<Text strong>Address:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.address} disabled />
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Municipality:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.municipal} disabled />
						</Col>
					</Row>
				</Modal>
			</div>

			<div className="modals">
				<Modal
					title="Validate Citizen User"
					width={1000}
					open={isValidated}
					onCancel={() => {
						setIsValidated(false);
						setImg();
					}}
					footer={[
						<Button
							key="cancel"
							onClick={() => {
								setIsValidated(false);
								setImg();
							}}
						>
							Cancel
						</Button>,
						<Button key="reject" type="danger" onClick={() => RejectionOfRecord(validationData?.email)}>
							Reject
						</Button>,
						<Button key="validate" type="primary" onClick={() => ValidationOfRecord(validationData?.email)}>
							Validate
						</Button>,
					]}
				>
					<Row gutter={12}>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<Text strong>Uploaded Document</Text>
							<br />
							<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
								<Image style={{ border: "1px solid black", marginTop: "10px" }} height={100} width={100} src={img} alt="view" />
							</div>
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Citizen ID:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.citizenId} disabled />
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Email Address:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.email} disabled />
						</Col>
					</Row>
					<Row gutter={12}>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>First Name:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.firstName} disabled />
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Middle Name:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.middleName === "undefined" ? "N/A" : validationData?.middleName} disabled />
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Last Name:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.lastName} disabled />
						</Col>
					</Row>
					<Row gutter={12}>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Gender:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.gender} disabled />
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Date of Birth:</Text>
							<Input style={{ marginBottom: "8px" }} value={new Date(validationData?.birthdate).toDateString()} disabled />
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Account Status:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.accountstatus} disabled />
						</Col>
					</Row>
					<Row gutter={12}>
						<Col xs={{ span: 24 }} md={{ span: 16 }}>
							<br></br>
							<Text strong>Address:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.address} disabled />
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<br></br>
							<Text strong>Municipality:</Text>
							<Input style={{ marginBottom: "8px" }} value={validationData?.municipal} disabled />
						</Col>
					</Row>
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
		weight: 1000px
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

// filters: [
// 	{
// 		text: "Pending",
// 		value: "Pending",
// 	},
// 	{
// 		text: "Validated",
// 		value: "Validated",
// 	},
// 	{
// 		text: "Deleted",
// 		value: "Deleted",
// 	},
// ],
// filteredValue: filteredInfo.accountstatus || null,
// onFilter: (value, record) => record.accountstatus.includes(value),
// ellipsis: true,
// },
