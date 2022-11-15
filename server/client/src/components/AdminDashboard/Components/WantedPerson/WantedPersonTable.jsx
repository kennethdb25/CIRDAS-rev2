import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { SearchOutlined, EyeOutlined, PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Modal, Typography, Row, Col, Image, Tag, Drawer, message, Form, Radio, Select } from "antd";
import WantedPersonForm from "./WantedPersonForm";
import { MunicipalData } from "../../../../data/CitizensData";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function WantedPersonTable() {
	const [img, setImg] = useState();
	const [viewData, setViewData] = useState(null);
	const [data, setData] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [visible, setVisible] = useState(false);
	const [isView, setIsView] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [updateData, setUpdateData] = useState(null);
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);
	const [loading, setLoading] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [pagination, setPagination] = useState({
		defaultCurrent: 1,
		pageSize: 6,
		total: data[0]?.body.length,
	});
	const [form] = Form.useForm();

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchData = async () => {
		setLoading(true);
		const res = await fetch("/wanted-person", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const dataComp = await res.json();
		setData([dataComp]);
		setLoading(false);
	};

	const UpdateRecord = (record) => {
		setIsEdit(true);
		setVisible(true);
		setUpdateData(record);
	};

	const initialValuesUpdate = {
		address: updateData?.address,
		age: updateData?.age,
		description: updateData?.description,
		contact: updateData?.contact,
		cases: updateData?.cases,
		eyes: updateData?.eyes,
		name: updateData?.name,
		gender: updateData?.gender,
		hair: updateData?.hair,
		height: updateData?.height,
		municipal: updateData?.municipal,
	};

	const onFinishUpdate = async (values) => {
		const newData = new FormData();
		newData.append("address", values.address);
		newData.append("age", values.age);
		newData.append("contact", values.contact);
		newData.append("description", values.description);
		newData.append("eyes", values.eyes);
		newData.append("name", values.name);
		newData.append("gender", values.gender);
		newData.append("hair", values.hair);
		newData.append("height", values.height);
		newData.append("municipal", values.municipal);
		const data = await fetch(`/wanted-person/update/${updateData?.wantedId}`, {
			method: "PATCH",
			body: newData,
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

	const onFinishUpdateFailed = (errorInfo) => {
		message.error("Please input all the required details");
	};

	const ViewRecord = (record) => {
		setIsView(true);
		setViewData(record);
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
	};

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

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
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

	const onClose = () => {
		setVisible(false);
		setIsEdit(false);
		form.resetFields();
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "wantedId",
			key: "wantedId",
			width: "15%",
			...getColumnSearchProps("wantedId"),
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			width: "15%",
			...getColumnSearchProps("name"),
		},
		{
			title: "Age",
			dataIndex: "age",
			key: "age",
			width: "5%",
		},
		{
			title: "Case",
			dataIndex: "cases",
			key: "cases",
			width: "10%",
			...getColumnSearchProps("address"),
		},
		{
			title: "Municipal",
			dataIndex: "municipal",
			key: "municipal",
			width: "10%",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			width: "5%",
			render: (_, { status }) => {
				let color;
				if (status === "Wanted") {
					color = "volcano";
				} else if (status === "Pending") {
					color = "geekblue";
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
					ADD WANTED PERSON
				</Button>
			),
			dataIndex: "",
			key: "x",
			width: "15%",
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
						<Button
							type="success"
							shape="round"
							icon={<EditOutlined />}
							onClick={() => {
								UpdateRecord(record);
								setTimeout(() => {
									form.resetFields();
								}, 10);
							}}
						>
							Edit
						</Button>
					</div>
				</>
			),
		},
	];

	return (
		<Section>
			<div className="table">
				<Table columns={columns} dataSource={data[0]?.body} pagination={pagination} loading={loading} />
			</div>
			<div className="drawer">
				<Drawer
					title={isEdit ? "UPDATE WANTED PERSON" : "ADD WANTED PERSON"}
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
										<Col xs={{ span: 24 }} md={{ span: 8 }}>
											<Form.Item
												label="Wanted Person's Fullname"
												name="name"
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
														message: "Please input wanted person's fullname!",
													},
													{
														pattern: /^[a-zA-Z_ ]*$/,
														message: "Fullname should have no number or special character.",
													},
												]}
											>
												<Input placeholder="Enter wanted person's fullname" />
											</Form.Item>
										</Col>
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
									</Row>
									<Row gutter={12}>
										<Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
											<Form.Item
												label="Filed Cases"
												name="cases"
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
														message: "Please enter last seen location",
													},
												]}
											>
												<Input placeholder="Enter last seen location" />
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
												label="Characteristics"
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
										File Missing Person
									</Button>
								</Col>

								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<Input hidden />
								</Col>
								<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
							</Row>
						</Form>
					) : (
						<>
							<WantedPersonForm fetchData={fetchData} onClose={onClose} />
						</>
					)}
				</Drawer>
			</div>
			<div className="modal">
				<Modal
					title="Wanted Person Details"
					width={800}
					open={isView}
					onCancel={() => {
						setIsView(false);
						setImg();
					}}
					onOk={() => {
						setIsView(false);
						setImg();
					}}
				>
					<Row>
						<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
						<Col xs={{ span: 24 }} md={{ span: 16 }}>
							<Row gutter={12}>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Title level={2}>{viewData?.name}</Title>
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
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Case:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.cases} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 12 }}>
									<br></br>
									<Text strong>Height:</Text>
									<Input style={{ marginBottom: "8px" }} value={viewData?.height} disabled />
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

								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<br></br>
									<Text strong>Identifying Characteristic:</Text>
									<TextArea autoSize="false" style={{ marginBottom: "8px" }} value={viewData?.description} disabled />
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Title level={5}>IF YOU HAVE ANY INFORMATION ABOUT</Title>
									</div>
								</Col>
								<Col xs={{ span: 24 }} md={{ span: 24 }}>
									<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Title level={4}>{viewData?.name.toUpperCase()},</Title>
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
