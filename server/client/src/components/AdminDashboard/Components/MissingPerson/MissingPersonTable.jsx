/* eslint-disable no-unused-vars */
import React, { useState, useRef, useContext, useEffect } from "react";
import styled from "styled-components";
import { SearchOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Modal, Typography, Row, Col, Image, Drawer, Form, message, Select } from "antd";
import MissingPersonForm from "./MissingPersonForm";
import { AdminMissingStatus } from "../../../../data/AdminData";

import { LoginContext } from "../../../../context/Context";
const { Title, Text } = Typography;
const { TextArea } = Input;

export default function MissingPersonTable(props) {
	const [img, setImg] = useState();
	const [viewData, setViewData] = useState(null);
	const [data, setData] = useState([]);
	const [status, setStatus] = useState(true);
	const [allData, setAllData] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [visible, setVisible] = useState(false);
	const [isView, setIsView] = useState(false);
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);
	const { loginData, setLoginData } = useContext(LoginContext);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({
		defaultCurrent: 1,
		pageSize: 6,
		total: data[0]?.body.length,
	});
	const [form] = Form.useForm();

	const { getFiledMissingPerson, getPendingStatus, getMissingStatus, getFoundStatus } = props;

	useEffect(() => {
		fetchData();
		fetchAllData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchData = async () => {
		setLoading(true);
		const res = await fetch(`/missing-person`, {
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
		setLoading(true);
		const res = await fetch(`/missing-person`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const dataComp = await res.json();
		setAllData([dataComp]);
		setLoading(false);
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

	const ViewRecord = (record) => {
		setIsView(true);
		setViewData(record);
	};

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
							Review
						</Button>
					</div>
				</>
			),
		},
	];

	const initialValues = {
		status: viewData?.status,
	};

	const enableStatus = () => {
		setStatus(false);
	};

	const onClearForms = () => {
		setIsView(false);
		setStatus(true);
	};

	const onClose = () => {
		setVisible(false);
	};

	const onFinish = async (values) => {
		// /admin/missing-person/:_id
		const data = await fetch(`/admin/missing-person/${viewData?._id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});
		const res = await data.json();
		if (res.status === 201) {
			message.success("Updated Successfully");
			form.resetFields();
			getFiledMissingPerson();
			getPendingStatus();
			getMissingStatus();
			getFoundStatus();
			fetchAllData();
			onClearForms();
		} else {
			message.error(res.error);
		}
	};
	const onFinishFailed = async (error) => {
		message.error(error);
	};

	return (
		<Section>
			<div className="table">
				<Title level={4}>Provincial List of Missing Person</Title>
				<Table columns={columnsAll} dataSource={allData[0]?.body} pagination={pagination} loading={loading} />
			</div>
			<Drawer
				title="FILE A MISSING PERSON"
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
				<MissingPersonForm fetchData={fetchData} fetchAllData={fetchAllData} onClose={onClose} />
			</Drawer>

			<div className="modal">
				<Modal
					title="Missing Person Details"
					width={800}
					open={isView}
					onCancel={() => {
						onClearForms();
						setImg();
					}}
					footer={[
						<Button
							key="cancel"
							onClick={() => {
								onClearForms();
								setImg();
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
						}}
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
									<Col xs={{ span: 24 }} md={{ span: 12 }}>
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
									<Col xs={{ span: 24 }} md={{ span: 24 }}>
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
												<Input value={viewData?.status} disabled />
											) : (
												<Select style={{ width: "100%" }} disabled={status}>
													{AdminMissingStatus.map((value, index) => (
														<Select.Option key={index} value={value.name}>
															{value.label}
														</Select.Option>
													))}
												</Select>
											)}
										</Form.Item>
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
									<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center" }}></div>
									{status ? (
										<></>
									) : (
										<Button type="primary" htmlType="submit">
											Update
										</Button>
									)}
								</Row>
							</Col>
						</Row>
					</Form>
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
