import React, { useState, useRef, useContext, useEffect } from "react";
import styled from "styled-components";
import { SearchOutlined, PlusCircleOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import { MunicipalData } from "../../../../data/CitizensData";
import { AdminRole } from "../../../../data/AdminData";
import { Button, Input, Space, Table, Modal, message, Select, DatePicker, Typography, Drawer, Form, Row, Col, Image, Radio, Upload } from "antd";
import { LoginContext } from "../../../../context/Context";
const { Title, Text } = Typography;
const { TextArea } = Input;

export default function UserAccountTable() {
	const [getCitizen, setGetCitizen] = useState([]);
	const [validationData, setValidationData] = useState(null);
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
		console.log(record);
	};

	const onValidateRecord = (record) => {
		setIsValidated(true);
		setValidationData(record);
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
			toast.success("Validation Completed", { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
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
			toast.success("Rejection Completed", { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
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

	const CitizenColumn = [
		{
			title: "ID",
			dataIndex: "citizenId",
			key: "citizenId",
			width: "5%",
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
			filters: [
				{
					text: "Pending",
					value: "Pending",
				},
				{
					text: "Validated",
					value: "Validated",
				},
				{
					text: "Deleted",
					value: "Deleted",
				},
				{
					text: "Rejected",
					value: "Rejected",
				},
			],
			filteredValue: filteredInfo.accountstatus || null,
			onFilter: (value, record) => record.accountstatus.includes(value),
			ellipsis: true,
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

	useEffect(() => {
		getCitizenUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Section>
			<div className="table">
				<Title level={4}>CITIZEN USERS</Title>
				<Table columns={CitizenColumn} dataSource={getCitizen[0]?.body} pagination={pagination} loading={loading} onChange={handleChange} />
			</div>
			<div className="modals">
				<Modal
					title="Validate Citizen User"
					width={1000}
					open={isValidated}
					onCancel={() => setIsValidated(false)}
					footer={[
						<Button key="cancel" onClick={() => setIsValidated(false)}>
							Cancel
						</Button>,
						<Button key="cancel" type="danger" onClick={() => RejectionOfRecord(validationData?.email)}>
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
								<Image
									style={{ border: "1px solid black", marginTop: "10px" }}
									height={100}
									width={100}
									src={validationData ? require(`../../../AdminDashboard/assets/ValidationIdUploads/${validationData?.imgpath}`) : ""}
									alt="view"
								/>
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
