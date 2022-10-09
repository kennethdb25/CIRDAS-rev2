/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components";
import { PlusCircleOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Modal, Typography, Drawer, Form } from "antd";
import { fetchData } from "../Services/Complaint/APICall";
import { getColumnSearchProps } from "../Services/Complaint/TableService";
import { LoginContext } from "../../../../context/Context";
import ComplaintForm from "./ComplaintForm";
import ComplaintUpdateForm from "./ComplaintUpdateForm";

export default function ComplaintTable(props) {
	const [data, setData] = useState([]);
	const [updateData, setUpdateData] = useState(null);
	const searchInput = useRef(null);
	const { loginData, setLoginData } = useContext(LoginContext);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const [viewData, setViewData] = useState(null);
	const [isView, setIsView] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [pagination, setPagination] = useState({
		defaultCurrent: 1,
		pageSize: 6,
		total: data[0]?.body.length,
	});

	const { getFiledComplaint, getPendingComplaints, getReviewedComplaints, getUnderInvestigation } = props;

	const [form] = Form.useForm();

	const onClose = () => {
		setVisible(false);
		form.resetFields();
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
	};

	const UpdateRecord = (record) => {
		setIsEdit(true);
		setVisible(true);
		setUpdateData(record);
	};

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
			...getColumnSearchProps("complaintid", searchInput, setSearchText, setSearchedColumn, handleReset, searchedColumn, searchText),
		},
		{
			title: "Complainant Name",
			dataIndex: "complainantname",
			key: "complainantname",
			width: "30%",
			...getColumnSearchProps("complainantname", searchInput, setSearchText, setSearchedColumn, handleReset, searchedColumn, searchText),
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
			...getColumnSearchProps("address", searchInput, setSearchText, setSearchedColumn, handleReset, searchedColumn, searchText),
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
			...getColumnSearchProps("suspect", searchInput, setSearchText, setSearchedColumn, handleReset, searchedColumn, searchText),
			width: "30%",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			width: "10%",
		},
		{
			title: (
				<Button type="primary" shape="round" icon={<PlusCircleOutlined />} onClick={() => setVisible(true)}>
					File a Complaint
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
						{record.status === "Pending" ? (
							<Button
								type="success"
								shape="round"
								icon={<EditOutlined />}
								onClick={() => {
									UpdateRecord(record);
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

	useEffect(() => {
		fetchData(setLoading, loginData, setData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Section>
			<div className="table">
				<Table columns={columns} dataSource={data[0]?.body} pagination={pagination} loading={loading} />
			</div>
			<Drawer
				title={isEdit ? "Update Complaint" : "File A Complaint"}
				placement="top"
				width={500}
				onClose={onClose}
				open={visible}
				height={630}
				style={{
					display: "flex",
					justifyContent: "center",
				}}
				extra={<Space></Space>}
			>
				{isEdit ? (
					<>
						<ComplaintUpdateForm onClose={onClose} fetchData={fetchData} updateData={updateData} />
					</>
				) : (
					<>
						<ComplaintForm
							onClose={onClose}
							fetchData={fetchData}
							getFiledComplaint={getFiledComplaint}
							getPendingComplaints={getPendingComplaints}
							getReviewedComplaints={getReviewedComplaints}
							getUnderInvestigation={getUnderInvestigation}
						/>
					</>
				)}
			</Drawer>
			<Modal title="Complaint Details" open={isView} onCancel={() => setIsView(false)} onOk={() => setIsView(false)}>
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
				<Typography>Status</Typography>
				<Input value={viewData?.status} disabled />
			</Modal>
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
