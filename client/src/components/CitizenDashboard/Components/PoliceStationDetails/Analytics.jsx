import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Button, Input, Space, Table, Modal, Typography, Drawer, Form, Row, Col, Image } from "antd";
import { SearchOutlined, PlusCircleOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

export default function Analytics() {
	const [viewData, setViewData] = useState(null);
	const [data, setData] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [visible, setVisible] = useState(false);
	const [isView, setIsView] = useState(false);
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);
	const [pagination, setPagination] = useState({
		defaultCurrent: 1,
		pageSize: 3,
		total: data[0]?.body.length,
	});

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
			dataIndex: "stationId",
			key: "stationId",
			width: "10%",
			...getColumnSearchProps("stationId"),
		},
		{
			title: "Municipal",
			dataIndex: "Municipal",
			key: "Municipal",
			width: "10%",
			...getColumnSearchProps("Municipal"),
		},
		{
			title: "Contact Number",
			dataIndex: "contactnumber",
			key: "contactnumber",
			width: "20%",
		},
		{
			title: "Municipal OIC",
			dataIndex: "MunicipalOIC",
			key: "MunicipalOIC",
			width: "30%",
			...getColumnSearchProps("MunicipalOIC"),
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
						{record.status !== "Found" ? (
							<Button type="success" shape="round" icon={<EditOutlined />}>
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
			<Table columns={columns} />
		</Section>
	);
}
const Section = styled.section`
display: flex;
flex-direction: column;
justify-content: space-between;
min-height: 100%;
modal: {
	weight: 1000px
	input: {
		color: None;
	}
}
`;
