import React, { useState, useRef, useContext, useEffect } from "react";
import styled from "styled-components";
import { SearchOutlined, PlusCircleOutlined, EyeOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Modal, Typography, Drawer, Form, Row, Col, Image } from "antd";
const { Title, Text } = Typography;
const { TextArea } = Input;

export default function WantedPersonTable() {
	const [viewData, setViewData] = useState(null);
	const [data, setData] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [visible, setVisible] = useState(false);
	const [isView, setIsView] = useState(false);
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({
		defaultCurrent: 1,
		pageSize: 6,
		total: data[0]?.body.length,
	});

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
		console.log(dataComp);
	};

	const onClose = () => {
		setVisible(false);
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
		console.log(record.imgpath);
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "wantedid",
			key: "wantedid",
			width: "15%",
			...getColumnSearchProps("wantedid"),
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
		},
		{
			title: "Action",
			dataIndex: "",
			key: "x",
			width: "15%",
			render: (record) => (
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
			),
		},
	];

	return (
		<Section>
			<div className="table">
				<Table columns={columns} dataSource={data[0]?.body} pagination={pagination} loading={loading} />
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
