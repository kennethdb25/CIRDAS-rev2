import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space } from "antd";

const handleSearch = (selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn) => {
	confirm();
	setSearchText(selectedKeys[0]);
	setSearchedColumn(dataIndex);
};

export const getColumnSearchProps = (dataIndex, searchInput, setSearchText, setSearchedColumn, handleReset, searchedColumn, searchText) => ({
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
				onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)}
				style={{
					marginBottom: 8,
					display: "block",
				}}
			/>
			<Space>
				<Button
					type="primary"
					onClick={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)}
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
		<>
			<SearchOutlined
				style={{
					color: filtered ? "#1890ff" : undefined,
					fontSize: "10px",
				}}
			/>
		</>
	),
	onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
	onFilterDropdownVisibleChange: (visible) => {
		if (visible) {
			setTimeout(() => searchInput.current?.select(), 100);
		}
	},
	render: (text) =>
		searchedColumn === dataIndex ? (
			<>
				<Highlighter
					highlightStyle={{
						backgroundColor: "#ffc069",
						padding: 0,
					}}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ""}
				/>
			</>
		) : (
			text
		),
});
