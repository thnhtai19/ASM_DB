import React, { useState, useRef, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, Spin, Table } from 'antd'
import TableComponent from '../../components/TableComponent/TableComponent'
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const StaticSalePage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  const formRef = useRef(null); 

  const [danh_sach_don_hang, set_danh_sach_don_hang] = useState([])
  const [Loading, SetLoading] = useState([])

  const fetchStatics = async () => {
    SetLoading(true)
    try {
      const res = await axios.get(`${apiUrl}admin`, {
        withCredentials: true,
      });
      console.log(res.status)
      if(res.status === 200){
        set_danh_sach_don_hang(res.data.danh_sach_nguoi_ban.reverse());
        SetLoading(false)
      }
    } catch (err) {
      if(err.status === 401){
        sessionStorage.clear();
        window.location.href = '/'
      }
    } finally {
      
    }
  };

  useEffect(() => {
    fetchStatics();
  }, []);




  function showModal(items) {
    const product = danh_sach_don_hang.find(item => item.MaNguoiBan === items[0]);
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

  const columns = [
    {
      name: "MaNguoiBan",
      label: "Mã người bán"
    },
    {
      name: "TenNguoiBan",
      label: "Tên người bán"
    },
    {
      name: "TenCuaHang",
      label: "Tên cửa hàng"
    },
    {
      name: "SoLuongSanPhamDaBan",
      label: "Số lượng đã bán"
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
    <div className='p-4'>
      <div className='flex gap-2 text-sm text-gray-500 pb-4'>
        <a className='text-black' href='/admin/home'>BK Admin</a> 
        <div className='text-black'>&gt;</div>
        <div>Thống kê bán hàng</div>
      </div>
      
      <div className='pt-4 rounded-lg shadow-lg bg-white'>
        <TableComponent columns={columns} data={danh_sach_don_hang} title="Thống kê bán hàng" />
      </div>

      {/* Modal for details */}
      <Modal
        title="Chi tiết thống kê"
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
                <Form.Item label="Mã người bán" name="manguoiban" initialValue={currentItem.MaNguoiBan}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tên người bán" name="tennguoiban" initialValue={currentItem.TenNguoiBan}>
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Tên cửa hàng" name="tencuahang" initialValue={currentItem.TenCuaHang}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Số lượng đã bán" name="soluongdaban" initialValue={currentItem.SoLuongSanPhamDaBan}>
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

    
            <div className='pb-2'>Sản phẩm đã bán</div>
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
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
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
}

export default StaticSalePage;
