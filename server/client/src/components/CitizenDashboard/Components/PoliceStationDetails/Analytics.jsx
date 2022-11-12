/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Button, Input, Space, Table, Modal, Typography } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

export default function Analytics() {
	const [viewData, setViewData] = useState(null);
	const [data, setData] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [loading, setLoading] = useState(false);
	const [isView, setIsView] = useState(false);
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);
	const [pagination, setPagination] = useState({
		defaultCurrent: 1,
		pageSize: 3,
		total: data[0]?.body.length,
	});

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchData = async () => {
		setLoading(true);
		const res = await fetch("/station-details", {
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
			dataIndex: "stationdId",
			key: "stationdId",
			width: "10%",
			...getColumnSearchProps("stationdId"),
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
			title: "Station Name",
			dataIndex: "details",
			key: "details",
			width: "30%",
			...getColumnSearchProps("details"),
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

	return (
		<Section>
			<div className="table">
				<Table columns={columns} dataSource={data[0]?.body} pagination={pagination} loading={loading} />
			</div>
			<Modal
				title="Police Station Location Details"
				open={isView}
				onCancel={() => setIsView(false)}
				footer={[
					<Button
						key="cancel23"
						onClick={() => {
							setIsView(false);
						}}
					>
						Close
					</Button>,
				]}
			>
				<Typography>Station ID</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.stationdId} disabled />
				<Typography>Municipal</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.Municipal} disabled />
				<Typography>Station Name</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.details} disabled />
				<Typography>Municipal OIC</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.MunicipalOIC} disabled />
				<Typography>Contact Number</Typography>
				<Input style={{ marginBottom: "15px" }} value={viewData?.contactnumber} disabled />
			</Modal>
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
