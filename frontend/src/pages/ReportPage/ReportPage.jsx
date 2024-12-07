import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, DatePicker, Breadcrumb, Input, Button, Row, Col, Modal } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Search } = Input;

const ReportPage = () => {
	const [pageSize, setPageSize] = useState(10);
	const [dataSource] = useState([
		{
			id: '2220',
			semester: 'HK241',
			month: '09/2024',
			content: 'Báo cáo sử dụng hệ thống tháng 9/test1',
			createdTime: '14-09-2024 00:55:44',
			printers: [
				{
					printerId: '2219',
					printerName: 'Máy in 1',
					orders: 60,
					pagesA3: 150,
					pagesA4: 1600,
				},
				{
					printerId: '2221',
					printerName: 'Máy in 3',
					orders: 50,
					pagesA3: 149,
					pagesA4: 1300,
				},
			],
			chartData: [
				{ name: 'Đơn hàng', value: 900 },
				{ name: 'Người dùng', value: 120 },
				{ name: 'Doanh thu', value: 65 },
			],
		},
	]);

	const [filteredData, setFilteredData] = useState(dataSource);
	const [selectedDates, setSelectedDates] = useState([null, null]);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedReport, setSelectedReport] = useState(null);

	const paginationOptions = {
		pageSize,
		showSizeChanger: true,
		pageSizeOptions: ['5', '10', '20'],
		onShowSizeChange: (current, size) => setPageSize(size),
	};

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
		},
		{
			title: 'Học kỳ',
			dataIndex: 'semester',
		},
		{
			title: 'Tháng',
			dataIndex: 'month',
		},
		{
			title: 'Nội dung',
			dataIndex: 'content',
		},
		{
			title: 'Thời gian tạo báo cáo',
			dataIndex: 'createdTime',
		},
		{
			title: 'Hành động',
			dataIndex: 'action',
			render: (_, record) => (
				<Button type='primary' onClick={() => showModal(record)}>
					Xem
				</Button>
			),
		},
	];

	const parseDateTime = (dateTimeStr) => {
		const [datePart, timePart] = dateTimeStr.split(' ');
		const [day, month, year] = datePart.split('-');
		return new Date(`${year}-${month}-${day}T${timePart}`);
	};

	const filterData = (searchValue, selectedRange) => {
		let filtered = dataSource;

		if (searchValue) {
			filtered = filtered.filter((item) => item.content.toLowerCase().includes(searchValue.toLowerCase()));
		}

		if (selectedRange && selectedRange[0] && selectedRange[1]) {
			const [start, end] = selectedRange;
			const endOfDay = new Date(end);
			endOfDay.setHours(23, 59, 59, 999);

			filtered = filtered.filter((item) => {
				const reportDate = parseDateTime(item.createdTime);
				return reportDate >= start && reportDate <= endOfDay;
			});
		}

		setFilteredData(filtered);
	};

	const handleDateChange = (dates, index) => {
		const updatedDates = [...selectedDates];
		updatedDates[index] = dates;
		setSelectedDates(updatedDates);
		filterData(null, updatedDates);
	};

	const handleSearch = (value) => {
		filterData(value, selectedDates);
	};

	const showModal = (record) => {
		setSelectedReport(record);
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setSelectedReport(null);
	};

	return (
		<div className='p-2 min-h-screen ml-2'>
			<Breadcrumb separator='>'>
				<Breadcrumb.Item>
					<Link to='/'>bkssps.vn</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link to='/admin/home'>Admin</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>Báo cáo sử dụng</Breadcrumb.Item>
			</Breadcrumb>

			<div className='p-[20px]'>
				<Row gutter={16} align='middle'>
					<Col>
						<span className='flex items-center'>
							<FilterOutlined style={{ marginRight: 8 }} />
							Lọc từ ngày:
						</span>
					</Col>
					<Col>
						<DatePicker placeholder='Từ ngày' onChange={(date) => handleDateChange(date, 0)} />
					</Col>
					<Col>
						<DatePicker placeholder='Đến ngày' onChange={(date) => handleDateChange(date, 1)} />
					</Col>
				</Row>
			</div>

			<div className='flex items-center justify-center mt-7'>
				<div className='flex flex-col bg-white p-6 rounded-lg shadow-lg w-[95%] md:w-[95%]'>
					<h3 className='text-xl font-semibold text-gray-800 mb-6 border-b pb-2'>Báo cáo sử dụng</h3>

					<div className='mb-4'>
						<Search placeholder='Tìm kiếm nội dung' onSearch={handleSearch} style={{ width: 200 }} />
					</div>

					<Table columns={columns} dataSource={filteredData} pagination={paginationOptions} bordered />
				</div>
			</div>

			<Modal title='Chi tiết báo cáo' visible={isModalVisible} onCancel={handleCancel} footer={null} width={800}>
				{selectedReport && (
					<div>
						<h2 className='text-lg font-semibold'>{selectedReport.content}</h2>
						<p className='mb-4'>Thời gian tạo: {selectedReport.createdTime}</p>

						<Table
							dataSource={selectedReport.printers}
							columns={[
								{ title: 'ID máy in', dataIndex: 'printerId', key: 'printerId' },
								{ title: 'Tên máy in', dataIndex: 'printerName', key: 'printerName' },
								{ title: 'Số đơn hàng', dataIndex: 'orders', key: 'orders' },
								{ title: 'Số trang A3 đã dùng', dataIndex: 'pagesA3', key: 'pagesA3' },
								{ title: 'Số trang A4 đã dùng', dataIndex: 'pagesA4', key: 'pagesA4' },
							]}
							pagination={false}
							className='mb-6'
						/>

						<ResponsiveContainer width='100%' height={300}>
							<BarChart data={selectedReport.chartData} layout='vertical' barSize={20}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis type='number' />
								<YAxis dataKey='name' type='category' />
								<Tooltip />
								<Legend />
								<Bar dataKey='value' fill='#8884d8' />
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default ReportPage;
