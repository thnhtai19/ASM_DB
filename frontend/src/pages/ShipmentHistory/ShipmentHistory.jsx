import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Spin, message, Table, DatePicker } from 'antd';
import TableComponent from '../../components/TableComponent/TableComponent';
import axios from 'axios';
import moment from 'moment';

const apiUrl = process.env.REACT_APP_API_URL;

const ShipmentHistory = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const formRef = useRef(null);
  const [danh_sach_don_hang, set_danh_sach_don_hang] = useState([]);
  const [Loading, SetLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  const fetchProducts = async (date) => {
    SetLoading(true);
    try {
      const res = await axios.post(
        `${apiUrl}order/statistics`,
        { ngay: date },
        { withCredentials: true }
      );
      if (res.status === 200) {
        set_danh_sach_don_hang(res.data.data.reverse());
      }
    } catch (err) {
      if (err.response?.status === 401) {
        sessionStorage.clear();
        window.location.href = '/';
      } else {
        message.error('Lỗi khi tải dữ liệu!');
      }
    } finally {
      SetLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedDate); 
  }, [selectedDate]);

  const onDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const onFinish = (values) => {
    if (values.date) {
      fetchProducts(values.date.format('YYYY-MM-DD'));
    }
  };

  const handleCloseDetailsModal = () => {
    setIsModalVisible(false);
    setCurrentItem(null);
    formRef.current?.resetFields();
  };

  const columns = [
    {
      name: 'MaSanPham',
      label: 'Mã sản phẩm',
    },
    {
      name: 'TenSanPham',
      label: 'Tên sản phẩm',
    },
    {
      name: 'SoDonHang',
      label: 'Số đơn hàng',
    },
    {
      name: 'TongSoLuong',
      label: 'Số lượng bán',
    },
    {
      name: 'TongGiaTri',
      label: 'Tổng tiền',
      options: {
        customBodyRender: (value) => (
          <span>
            {Number(value).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </span>
        ),
      },
    },
  ];

  if (Loading) {
    return (
      <Spin
        size="large"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      />
    );
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 text-sm text-gray-500 pb-4">
        <a className="text-black" href="/admin/home">
          BK Admin
        </a>
        <div className="text-black">&gt;</div>
        <div>Lịch sử xuất hàng</div>
      </div>

      <Form onFinish={onFinish} layout="inline" initialValue={moment(selectedDate, 'YYYY-MM-DD')}>
        <Form.Item name="date" label="Chọn ngày" rules={[{ message: 'Vui lòng chọn ngày!' }]}>
          <DatePicker
            format="YYYY-MM-DD"
            onChange={onDateChange}
            value={moment(selectedDate, 'YYYY-MM-DD')}
          />
        </Form.Item>
      </Form>

      <div className="pt-4 rounded-lg shadow-lg bg-white">
        <TableComponent columns={columns} data={danh_sach_don_hang}  title={`Lịch sử xuất hàng ngày ${selectedDate}`}  />
      </div>

      {/* Modal for details */}
      <Modal
        title="Lịch sử xuất hàng"
        visible={isModalVisible}
        onCancel={handleCloseDetailsModal}
        centered={true}
        footer={null}
        key={currentItem ? currentItem.id : 'modalKey'}
      >
        {currentItem && (
          <Form ref={formRef} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Mã người bán"
                  name="manguoiban"
                  initialValue={currentItem.MaNguoiBan}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tên người bán"
                  name="tennguoiban"
                  initialValue={currentItem.TenNguoiBan}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên cửa hàng"
                  name="tencuahang"
                  initialValue={currentItem.TenCuaHang}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số lượng đã bán"
                  name="soluongdaban"
                  initialValue={currentItem.SoLuongSanPhamDaBan}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <div className="pb-2">Sản phẩm đã bán</div>
            <Table
              dataSource={currentItem.Chi_tiet_san_pham_da_ban}
              columns={[
                {
                  title: 'Tên sản phẩm',
                  dataIndex: 'TenSanPham',
                  key: 'TenSanPham',
                },
                {
                  title: 'Giá',
                  dataIndex: 'Gia',
                  key: 'Gia',
                  render: (value) =>
                    new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(value),
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'SoLuong',
                  key: 'SoLuong',
                },
              ]}
              pagination={{
                pageSize: 5,
              }}
            />
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ShipmentHistory;
