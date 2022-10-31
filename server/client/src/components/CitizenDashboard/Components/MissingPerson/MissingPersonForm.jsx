import React, { useContext } from "react";
import { Button, Form, Input, Select, Row, Col, message, DatePicker, Radio, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "antd/dist/antd.min.css";
import { toast } from "react-toastify";
import { LoginContext } from "../../../../context/Context";
import { MunicipalData } from "../../../../data/CitizensData";

const { TextArea } = Input;

const MissingPersonForm = (props) => {
	const [form] = Form.useForm();
	const { loginData } = useContext(LoginContext);
	const contactperson = `${loginData.validcitizen?.firstName} ${loginData.validcitizen?.lastName}`;
	const complainantid = `${loginData.validcitizen?._id}`;

	const { onClose, fetchData, fetchAllData } = props;

	const onFinish = async (values) => {
		const newData = new FormData();
		newData.append("id", values.id);
		newData.append("photo", values.photo.file.originFileObj);
		newData.append("address", values.address);
		newData.append("age", values.age);
		newData.append("contact", values.contact);
		newData.append("contactperson", values.contactperson);
		newData.append("characteristics", values.description);
		newData.append("dob", values.dob);
		newData.append("eyes", values.eyes);
		newData.append("fullname", values.fullname);
		newData.append("gender", values.gender);
		newData.append("hair", values.hair);
		newData.append("height", values.height);
		newData.append("lastseen", values.lastseen);
		newData.append("municipal", values.municipal);
		newData.append("race", values.race);
		newData.append("wearing", values.wearing);
		newData.append("weight", values.weight);

		const data = await fetch("/missing-person", {
			method: "POST",
			body: newData,
		});

		const res = await data.json();
		if (res.status === 201) {
			toast.success("Filed Successfully", { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
			onClose();
			fetchData();
			fetchAllData();
			form.resetFields();
		} else {
			toast.error(res.error, { position: toast.POSITION.TOP_CENTER });
		}
	};

	const onFinishFailed = (errorInfo) => {
		message.error("Please input all the required details");
	};

	const imgprops = {
		beforeUpload: (file) => {
			const isIMG = file.type.startsWith("image");

			if (!isIMG) {
				message.error(`${file.name} is not an image`);
			}

			return isIMG || Upload.LIST_IGNORE;
		},
		onChange: (info) => {
			console.log(info.fileList);
		},
	};

	const onPreview = async (file) => {
		let src = file.url;

		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);

				reader.onload = () => resolve(reader.result);
			});
		}

		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow?.document.write(image.outerHTML);
	};
	return (
		<Form
			orm
			form={form}
			labelCol={{
				span: 8,
			}}
			initialValues={{ id: complainantid, contactperson: contactperson }}
			layout="horizontal"
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
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
						<Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
							<Form.Item
								label="Contact Person Name"
								name="contactperson"
								labelCol={{
									span: 24,
								}}
								wrapperCol={{
									span: 24,
								}}
								hasFeedback
							>
								<Input placeholder="Enter your first name" defaultValue={contactperson} disabled />
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<Form.Item
								label="Missing Person's Fullname"
								name="fullname"
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
										message: "Please input missing person's fullname!",
									},
									{
										pattern: /^[a-zA-Z_ ]*$/,
										message: "Fullname should have no number or special character.",
									},
								]}
							>
								<Input placeholder="Enter missing person's fullname" />
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<Form.Item
								label="Missing Person's Birth Date"
								name="dob"
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
										message: "Please enter missing person's birth date!",
									},
								]}
							>
								<DatePicker style={{ width: "100%" }} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={12}>
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
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<Form.Item
								label="Nationality"
								name="race"
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
										message: "Please input missing person's Race!",
									},
									{
										pattern: /^[a-zA-Z_ ]*$/,
										message: "Race should have no number or special",
									},
								]}
							>
								<Input placeholder="Enter missing person's Race" />
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
								label="Wearing"
								name="wearing"
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
										message: "Please input missing person's Wearing!",
									},
								]}
							>
								<Input placeholder="Enter missing person's Wearing" />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={12}>
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
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<Form.Item
								label="Weight (in kg)"
								name="weight"
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
										message: "Please input missing person's weight",
									},
									{
										pattern: /^[0-9]*$/,
										message: "Weight should be a number",
									},
								]}
							>
								<Input placeholder="Enter missing person's age" />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={12}>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<Form.Item
								label="Photo"
								name="photo"
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
										message: "Please upload an image",
									},
								]}
							>
								<Upload {...imgprops} listType="picture-card" maxCount={1} onPreview={onPreview}>
									<div>
										<PlusOutlined />
										<div style={{ marginTop: 8 }}>Upload</div>
									</div>
								</Upload>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} md={{ span: 8 }}>
							<Form.Item
								label="Last Seen Date"
								name="lastseen"
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
										message: "Please enter missing person's last seen date!",
									},
								]}
							>
								<DatePicker style={{ width: "100%" }} />
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
								label="How"
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
					<Form.Item name="id">
						<Input hidden defaultValue={complainantid} />
					</Form.Item>
				</Col>
				<Col xs={{ span: 24 }} md={{ span: 24 }}>
					<Input hidden />
				</Col>
				<Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
			</Row>
		</Form>
	);
};

export default MissingPersonForm;
