/* eslint-disable no-unused-vars */
import React, { useState, useRef, useContext, useEffect } from "react";
import styled from "styled-components";
import { SearchOutlined, PlusCircleOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { UilClipboardAlt, UilListUl } from "@iconscout/react-unicons";
import Highlighter from "react-highlight-words";
import { toast } from "react-toastify";

import { MunicipalData } from "../../../../data/CitizensData";
import { Button, Input, Space, Table, Modal, message, Select, DatePicker, Typography, Drawer, Form, Row, Col, Image, Radio, Upload, Tabs, Tag } from "antd";
import { LoginContext } from "../../../../context/Context";
import MissingPersonForm from "./MissingPersonForm";
const { Title, Text } = Typography;
const { TextArea } = Input;

export default function MissingPersonTable(props) {
	const [viewData, setViewData] = useState(null);
	const [img, setImg] = useState();
	const [updateData, setUpdateData] = useState(null);
	const [data, setData] = useState([]);
	const [allData, setAllData] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [visible, setVisible] = useState(false);
	const [isView, setIsView] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);
	const { loginData, setLoginData } = useContext(LoginContext);
	const [loading, setLoading] = useState(false);
	const [loading2, setLoading2] = useState(false);
	const [pagination, setPagination] = useState({
		defaultCurrent: 1,
		pageSize: 6,
		total: data[0]?.body.length,
	});

	useEffect(() => {
		fetchData();
		fetchAllData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// API CALL

	const fetchData = async () => {
		setLoading(true);
		const res = await fetch(`/missing-person/${loginData.validcitizen?._id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const dataComp = await res.json();
		setData([dataComp]);
		setLoading(false);
	};

	const fetchAllData = async () => {
		setLoading2(true);
		const res = await fetch(`/missing-person/status`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const dataComp = await res.json();
		setAllData([dataComp]);
		setLoading2(false);
	};

	// get image

	useEffect(() => {
		if (viewData) {
			fetch(`/uploads/${viewData?.imgpath}`)
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
	}, [viewData]);

	// ---------- END API CALL ------------

	const [form] = Form.useForm();
	const initialValues = {
		address: updateData?.address,
		age: updateData?.age,
		characteristics: updateData?.characteristics,
		contact: updateData?.contact,
		contactperson: updateData?.contactperson,
		dob: new Date(updateData?.dob).toLocaleDateString(),
		eyes: updateData?.eyes,
		fullname: updateData?.fullname,
		gender: updateData?.gender,
		hair: updateData?.hair,
		height: updateData?.height,
		id: updateData?.id,
		lastseen: new Date(updateData?.lastseen).toLocaleDateString(),
		lastlocation: updateData?.lastlocation,
		missingpersonid: updateData?.missingpersonid,
		municipal: updateData?.municipal,
		relation: updateData?.relation,
		race: updateData?.race,
		status: updateData?.status,
		timeAndDate: updateData?.timeAndDate,
		wearing: updateData?.wearing,
		weight: updateData?.weight,
		year: updateData?.year,
	};

	const onFinish = async (values) => {
		const newData = new FormData();
		newData.append("id", values.id);
		newData.append("address", values.address);
		newData.append("age", values.age);
		newData.append("contact", values.contact);
		newData.append("contactperson", values.contactperson);
		newData.append("characteristics", values.characteristics);
		newData.append("dob", values.dob);
		newData.append("eyes", values.eyes);
		newData.append("fullname", values.fullname);
		newData.append("gender", values.gender);
		newData.append("hair", values.hair);
		newData.append("height", values.height);
		newData.append("lastseen", values.lastseen);
		newData.append("lastlocation", values.lastlocation);
		newData.append("municipal", values.municipal);
		newData.append("relation", values.relation);
		newData.append("race", values.race);
		newData.append("wearing", values.wearing);
		newData.append("weight", values.weight);
		const data = await fetch(`/missing-person/update/${updateData?.missingpersonid}`, {
			method: "PATCH",
			body: newData,
		});

		const res = await data.json();
		if (res.status === 201) {
			toast.success("Updated Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
			onClose();
			fetchData();
			fetchAllData();
			form.resetFields();
		} else {
			toast.error(res.error, { position: toast.POSITION.TOP_CENTER });
		}
	};

	const onFinishFailed = (errorInfo) => {
		message.error("Please input all the required details");
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

	const onClose = () => {
		setVisible(false);
		setIsEdit(false);
		form.resetFields();
	};
	const UpdateRecord = (record) => {
		setIsEdit(true);
		setVisible(true);
		setUpdateData(record);
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

	const ViewRecord = (record) => {
		setViewData(record);
		setIsView(true);
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

	// get image

	const columnsAll = [
		{
			title: "ID",
			dataIndex: "missingpersonid",
			key: "missingpersonid",
			width: "10%",
			...getColumnSearchProps("missingpersonid"),
		},
		{
			title: "Name",
			dataIndex: "fullname",
			key: "fullname",
			width: "10%",
			...getColumnSearchProps("fullname"),
		},
		{
			title: "Age",
			dataIndex: "age",
			key: "age",
			width: "10%",
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
			width: "20%",
			...getColumnSearchProps("address"),
		},
		{
			title: "Municipal",
			dataIndex: "municipal",
			key: "municipal",
			width: "10%",
		},
		{
			title: "Contact",
			dataIndex: "contact",
			key: "contact",
			width: "10%",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			width: "5%",
			render: (_, { status }) => {
				let color;
				if (status === "Missing") {
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
			title: "",
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
								ViewRecord(record);
							}}
						>
							View
						</Button>
					</div>
				</>
			),
		},
	];

	const columns = [
		{
			title: "ID",
			dataIndex: "missingpersonid",
			key: "missingpersonid",
			width: "10%",
			...getColumnSearchProps("missingpersonid"),
		},
		{
			title: "Name",
			dataIndex: "fullname",
			key: "fullname",
			width: "10%",
			...getColumnSearchProps("fullname"),
		},
		{
			title: "Age",
			dataIndex: "age",
			key: "age",
			width: "10%",
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
			width: "20%",
			...getColumnSearchProps("address"),
		},
		{
			title: "Municipal",
			dataIndex: "municipal",
			key: "municipal",
			width: "10%",
		},
		{
			title: "Contact",
			dataIndex: "contact",
			key: "contact",
			width: "10%",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			width: "5%",
			render: (_, { status }) => {
				let color;
				if (status === "Missing") {
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
					FILE A MISSING PERSON
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
								ViewRecord(record);
							}}
						>
							View
						</Button>
						{record.status !== "Found" ? (
							<Button
								type="success"
								shape="round"
								icon={<EditOutlined />}
								onClick={() => {
									UpdateRecord(record);
									console.log(record);
									setTimeout(() => {
										form.resetFields();
									}, 10);
								}}
							>
								Edit
							</Button>
						) : (
							<></>
						)}
					</div>
				</>
			),
		},
	];

	return (
		<Section>
			<Tabs>
				<Tabs.TabPane tab="FILED CASES" key="key1">
					<div className="table">
						<div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
							<Title level={4}>FILED CASES</Title>
							<UilClipboardAlt />
						</div>
						<Table columns={columns} dataSource={data[0]?.body} pagination={pagination} loading={loading} />
					</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab="PROVINCIAL LIST" key="key2">
					<div className="table">
						<div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
							<Title level={4}>PROVINCIAL LIST</Title>
							<UilListUl />
						</div>
						<Table columns={columnsAll} dataSource={allData[0]?.body} pagination={pagination} loading={loading2} />
					</div>
				</Tabs.TabPane>
			</Tabs>

			<Drawer
				title={isEdit ? "UPDATE MISSING PERSON" : "FILE A MISSING PERSON"}
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
												label="Contact Person Name"
												name="contactperson"
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
												label="Missing Person's Fullname"
												name="fullname"
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
														message: "Please input missing person's fullname!",
													},
													{
														pattern: /^[a-zA-Z_ ]*$/,
														message: "Fullname should have no number or special character.",
													},
												]}
											>
												<Input placeholder="Enter missing person's fullname" />
											</Form.Item>
										</Col>
										<Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
											<Form.Item
												label="Relation"
												name="relation"
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
														message: "Please enter relation",
													},
												]}
											>
												<Input placeholder="Relation to the missing person" />
											</Form.Item>
										</Col>
									</Row>
									<Row gutter={12}>
										<Col xs={{ span: 24 }} md={{ span: 8 }}>
											<Form.Item
												label="Age"
												name="age"
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
														message: "Please input missing person's age!",
													},
													{
														pattern: /^[0-9]*$/,
														message: "Age should be a number.",
													},
												]}
											>
												<Input placeholder="Enter missing person's age" />
											</Form.Item>
										</Col>
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
										<Col xs={{ span: 24 }} md={{ span: 8 }}>
											<Form.Item
												label="Nationality"
												name="race"
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
														message: "Please input missing person's Race!",
													},
													{
														pattern: /^[a-zA-Z_ ]*$/,
														message: "Race should have no number or special",
													},
												]}
											>
												<Input placeholder="Enter missing person's Race" />
											</Form.Item>
										</Col>
									</Row>
									<Row gutter={12}>
										<Col xs={{ span: 24 }} md={{ span: 8 }}>
											<Form.Item
												label="Eye Color"
												name="eyes"
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
														message: "Please input missing person's Eye Color!",
													},
													{
														pattern: /^[a-zA-Z_ ]*$/,
														message: "Eye Color should have no number or special",
													},
												]}
											>
												<Input placeholder="Enter missing person's Eye Color " />
											</Form.Item>
										</Col>
										<Col xs={{ span: 24 }} md={{ span: 8 }}>
											<Form.Item
												label="Hair Color"
												name="hair"
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
														message: "Please input missing person's Hair Color!",
													},
													{
														pattern: /^[a-zA-Z_ ]*$/,
														message: "Hair Color should have no number or special",
													},
												]}
											>
												<Input placeholder="Enter missing person's age" />
											</Form.Item>
										</Col>
										<Col xs={{ span: 24 }} md={{ span: 8 }}>
											<Form.Item
												label="Wearing"
												name="wearing"
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
														message: "Please input missing person's Wearing!",
													},
												]}
											>
												<Input placeholder="Enter missing person's Wearing" />
											</Form.Item>
										</Col>
									</Row>
									<Row gutter={12}>
										<Col xs={{ span: 24 }} md={{ span: 8 }}>
											<Form.Item
												label="Height (in cm)"
												name="height"
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
														message: "Please input missing person's height!",
													},
													{
														pattern: /^[0-9]*$/,
														message: "Height should be a number",
													},
												]}
											>
												<Input placeholder="Enter missing person's height (in cm)" />
											</Form.Item>
										</Col>
										<Col xs={{ span: 24 }} md={{ span: 8 }}>
											<Form.Item
												label="Weight (in kg)"
												name="weight"
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
														message: "Please input missing person's weight",
													},
													{
														pattern: /^[0-9]*$/,
														message: "Weight should be a number",
													},
												]}
											>
												<Input placeholder="Enter missing person's age" />
											</Form.Item>
										</Col>
										<Col xs={{ span: 24 }} md={{ span: 8 }}>
											<Form.Item
												label="Missing Person's Birth Date"
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
														message: "Please enter missing person's birth date!",
													},
												]}
											>
												<Input />
											</Form.Item>
										</Col>
									</Row>
									<Row gutter={12}>
										<Col xs={{ span: 24 }} md={{ span: 8 }}>
											<Form.Item
												label="Last Seen Date"
												name="lastseen"
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
														message: "Please enter missing person's last seen date!",
													},
												]}
											>
												<Input />
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
										<Col xs={{ span: 24 }} md={{ span: 24 }}>
											<Form.Item
												label="How"
												name="characteristics"
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
														message: "Please enter identifying characteristic",
													},
												]}
											>
												<TextArea
													showCount
													maxLength={500}
													style={{
														height: 120,
													}}
												/>
											</Form.Item>
										</Col>
									</Row>
									<Button type="primary" htmlType="submit">
										Update Missing Person
									</Button>
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<Form.Item name="id">
										<Input hidden />
									</Form.Item>
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<Input hidden />
								</Col>
								<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
							</Row>
						</Form>
					</>
				) : (
					<>
						<MissingPersonForm fetchData={fetchData} fetchAllData={fetchAllData} onClose={onClose} />
					</>
				)}
			</Drawer>
			<div className="modal">
				<Modal
					title="Missing Person Details"
					width={800}
					open={isView}
					onCancel={() => {
						setIsView(false);
						setImg();
					}}
					footer={[
						<Button
							key="cancel23"
							onClick={() => {
								setIsView(false);
								setImg();
							}}
						>
							Cancel
						</Button>,
					]}
				>
					<Row>
						<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
						<Col xs={{ span: 24 }} md={{ span: 16 }}>
							<Row gutter={12}>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Title level={2}>{viewData?.fullname}</Title>
									</div>
								</Col>
							</Row>
							<Row gutter={12}>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Image style={{ border: "1px solid black" }} height={300} weight={300} src={img} alt="view" />
									</div>
								</Col>
							</Row>
							<Row gutter={12}>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<br></br>
									<Text strong>Contact Person:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.contactperson} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Relation to the missing person:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.relation} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Last Seen:</Text>
									<Input style={{ marginBottom: "8px" }} value={new Date(viewData?.lastseen).toDateString()} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Last Seen Location:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.lastlocation} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Date of Birth:</Text>
									<Input style={{ marginBottom: "8px" }} value={new Date(viewData?.dob).toDateString()} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Age:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.age} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Gender:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.gender} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Eyes:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.eyes} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Hair:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.hair} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Height:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.height} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Weight:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.weight} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Wearing:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.wearing} disabled />
								</Col>

								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Status:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.status} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<br></br>
									<Text strong>Identifying Characteristic:</Text>
									<TextArea autoSize="false" style={{ marginBottom: "8px" }} value={viewData?.characteristics} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Title level={5}>IF YOU HAVE ANY INFORMATION ABOUT {viewData?.fullname.toUpperCase()},</Title>
									</div>
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Title level={4}> PLEASE CONTACT: {viewData?.contact}</Title>
									</div>
								</Col>
							</Row>
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
