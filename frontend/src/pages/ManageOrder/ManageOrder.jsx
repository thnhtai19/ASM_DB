import React, { useState, useRef, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, Spin, message, Select, Table } from 'antd'
import TableComponent from '../../components/TableComponent/TableComponent'
import axios from 'axios';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const { Option } = Select;
const apiUrl = process.env.REACT_APP_API_URL;

const ManageOrder = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  const formRef = useRef(null);

  const [danh_sach_don_hang, set_danh_sach_don_hang] = useState([])
  const [Loading, SetLoading] = useState([])

  const fetchProducts = async () => {
    SetLoading(true)
    try {
      const res = await axios.get(`${apiUrl}order`, {
        withCredentials: true,
      });
      console.log(res.status)
      if (res.status === 200) {
        set_danh_sach_don_hang(res.data.data.reverse());
        SetLoading(false)
      }
    } catch (err) {
      if (err.status === 401) {
        sessionStorage.clear();
        window.location.href = '/'
      }
    } finally {

    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);




  function showModal(items) {
    const product = danh_sach_don_hang.find(item => item.MaDonHang === items[0]);
    setCurrentItem(product)
    console.log(product)
    setIsModalVisible(true)
  }

  // Handle modal close and reset form for Details Modal
  const handleCloseDetailsModal = () => {
    setIsModalVisible(false)
    setCurrentItem(null)
    formRef.current.resetFields();
  }

  const handleUpdate = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn cập nhật sản phẩm này?',
      centered: true,
      onOk: async () => {
        const formValues = formRef.current.getFieldsValue();

        try {
          const res = await axios.post(`${apiUrl}order/update`,
            {
              'MaDonHang': currentItem.MaDonHang,
              'TTThanhToan': formValues.trangthaithanhtoan,
              'TTDonHang': formValues.trangthaidonhang,
            },
            {
              withCredentials: true,
            }
          );

          if (res.status === 200) {

            set_danh_sach_don_hang((prev) =>
              prev.map((item) =>
                item.MaDonHang === currentItem.MaDonHang
                  ? {
                    ...item,
                    ...formValues,
                    TTThanhToan: formValues.TTThanhToan,
                    TTDonHang: formValues.trangthaidonhang,
                  }
                  : item
              )
            );


            message.success("Cập nhật sản phẩm thành công");
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật sản phẩm:", error);
          message.error("Đã xảy ra lỗi khi cập nhật sản phẩm.");
        }
      },
      onCancel: () => {
        console.log("Update canceled");
      },
    });
  };

  const columns = [
    {
      name: "MaDonHang",
      label: "Mã đơn hàng"
    },
    {
      name: "TenNguoiMua",
      label: "Tên người mua"
    },
    {
      name: "tongGTDon",
      label: "Tổng tiền",
      options: {
        customBodyRender: (value) => (
          <span>
            {Number(value).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        ),
      },
    },
    {
      name: "NgayDat",
      label: "Ngày đặt hàng"
    },
    {
      name: "TTDonHang",
      label: "Trạng thái đơn hàng"
    },
    {
      name: 'action',
      label: 'Hành động',
      options: {
        customBodyRender: (value, tableMeta) => (
          <Button type="primary" onClick={() => showModal(tableMeta.rowData)}>
            Chi tiết
          </Button>
        ),
      },
    }
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
    <HelmetProvider>
      <Helmet>
        <title>Quản lý đơn hàng</title>
      </Helmet>
      <div className='p-4'>
        <div className='flex gap-2 text-sm text-gray-500 pb-4'>
          <a className='text-black' href='/admin/home'>BK Admin</a>
          <div className='text-black'>&gt;</div>
          <div>Quản lý đơn hàng</div>
        </div>

        <div className='pt-4 rounded-lg shadow-lg bg-white'>
          <TableComponent columns={columns} data={danh_sach_don_hang} title="Danh sách đơn hàng" />
        </div>

        {/* Modal for details */}
        <Modal
          title="Chi tiết sản phẩm"
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
                  <Form.Item label="Tên người mua" name="tennguoimua" initialValue={currentItem.TenNguoiMua}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ngày đặt hàng" name="ngaydathang" initialValue={currentItem.NgayDat}>
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Tiền hàng" name="tienhang" initialValue={Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentItem.tienHang)}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phí vận chuyển" name="phivanchuyen" initialValue={Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentItem.PhiVanChuyen)}>
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Tổng giá trị" name="tonggiatri" initialValue={Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentItem.tongGTDon)}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phương thức thanh toán" name="phuongthucthanhtoan" initialValue={currentItem.PTThanhToan}>
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Trạng thái thanh toán" name="trangthaithanhtoan" initialValue={currentItem.TTThanhToan}>
                    <Select placeholder='Chọn trạng thái thanh toán'>
                      <Option value="Chưa thanh toán">Chưa thanh toán</Option>
                      <Option value="Đã thanh toán">Đã thanh toán</Option>
                      <Option value="Huỷ thanh toán">Huỷ thanh toán</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Trạng thái thanh toán" name="trangthaidonhang" initialValue={currentItem.TTDonHang}>
                    <Select placeholder='Chọn trạng thái đơn hàng'>
                      <Option value="Chưa giao hàng">Chưa giao hàng</Option>
                      <Option value="Đã giao hàng">Đã giao hàng</Option>
                      <Option value="Huỷ giao hàng">Huỷ giao hàng</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <div className='pb-2'>Danh sách sản phẩm</div>
              <Table
                dataSource={currentItem.ChiTietSanPham}
                columns={[
                  {
                    title: 'Tên sản phẩm',
                    dataIndex: 'TenSanPham',
                    key: 'TenSanPham',
                  },
                  {
                    title: 'Loại',
                    dataIndex: 'Loai',
                    key: 'Loai',
                  },
                  {
                    title: 'Số lượng',
                    dataIndex: 'SoLuong',
                    key: 'SoLuong',
                  },
                ]}
                rowKey={currentItem.MaSanPham}
                pagination={false}
              />


              <div className='flex justify-end gap-3 pt-4'>
                <Button type="primary" htmlType="submit" onClick={handleUpdate}>Cập nhật</Button>
              </div>
            </Form>
          )}
        </Modal>
      </div>
    </HelmetProvider>
  );
}

export default ManageOrder;
