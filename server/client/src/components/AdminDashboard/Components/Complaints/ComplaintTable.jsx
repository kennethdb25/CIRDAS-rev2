/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Modal, Typography, Select, Form } from "antd";
import { LoginContext } from "../../../../context/Context";
import { AdminComplaintStatus } from "../../../../data/AdminData";

export default function ComplaintTable() {
	const [data, setData] = useState([]);
	const [updateData, setUpdateData] = useState(null);
	const [status, setStatus] = useState(true);
	const searchInput = useRef(null);
	const { loginData, setLoginData } = useContext(LoginContext);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [viewData, setViewData] = useState(null);
	const [isView, setIsView] = useState(false);
	const [pagination, setPagination] = useState({
		defaultCurrent: 1,
		pageSize: 6,
		total: data[0]?.body.length,
	});

	console.log(loginData);

	const [form] = Form.useForm();

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
								setTimeout(() => {
									form.resetFields();
								}, 10);
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

	const onFinish = async (values) => {
		console.log(viewData);
		console.log(values);
	};

	const onFinishFailed = async (error) => {};
	return (
		<Section>
			<div className="table">
				<Table columns={columns} dataSource={data[0]?.body} pagination={pagination} loading={loading} />
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
						<Typography>Municipal</Typography>
						<Input style={{ marginBottom: "15px" }} value={viewData?.municipal} disabled />
						<Typography>Time and Date</Typography>
						<Input style={{ marginBottom: "15px" }} value={viewData?.timeAndDate} disabled />
						<Typography>Witness</Typography>
						<Input style={{ marginBottom: "15px" }} value={viewData?.witness} disabled />
						<Typography>Victim</Typography>
						<Input style={{ marginBottom: "15px" }} value={viewData?.victim} disabled />
						<Typography>Suspect</Typography>
						<Input style={{ marginBottom: "15px" }} value={viewData?.suspect} disabled />
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
								<Select style={{ width: "100%" }} disabled={status}>
									{AdminComplaintStatus.map((value, index) => (
										<Select.Option key={index} value={value.name}>
											{value.label}
										</Select.Option>
									))}
								</Select>
							)}
						</Form.Item>
						{status ? (
							<></>
						) : (
							<>
								{" "}
								<Button type="primary" htmlType="submit">
									Update
								</Button>
							</>
						)}
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
