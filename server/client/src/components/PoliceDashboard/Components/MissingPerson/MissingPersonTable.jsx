/* eslint-disable no-unused-vars */
import React, { useState, useRef, useContext, useEffect } from "react";
import styled from "styled-components";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { UilListUl } from "@iconscout/react-unicons";
import { Button, Input, Space, Table, Modal, Typography, Row, Col, Image } from "antd";

import { LoginContext } from "../../../../context/Context";
const { Title, Text } = Typography;
const { TextArea } = Input;

export default function MissingPersonTable(props) {
	const [img, setImg] = useState();
	const [viewData, setViewData] = useState(null);
	const [data, setData] = useState([]);
	const [allData, setAllData] = useState([]);
	const [searchText, setSearchText] = useState("");
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

	useEffect(() => {
		fetchData();
		fetchAllData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		setLoading(true);
		const res = await fetch(`/missing-person/status`, {
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
				<div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
					<Title level={4}>PROVINCIAL LIST</Title>
					<UilListUl />
				</div>
				<Table columns={columnsAll} dataSource={allData[0]?.body} pagination={pagination} loading={loading} />
			</div>

			<div className="modal">
				<Modal
					title="Missing Person Details"
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
