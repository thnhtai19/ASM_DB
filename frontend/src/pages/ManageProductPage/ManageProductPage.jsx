import React, { useState, useRef } from 'react'
import { Button, Modal, Form, Input, Row, Col, Select } from 'antd'
import TableComponent from '../../components/TableComponent/TableComponent'

const { Option } = Select;

const ManageProductPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  const formRef = useRef(null); // For the Details form
  const addProductFormRef = useRef(null); // For the Add Product form

  // Show details modal 
  function showModal(items) {
    const product = data.find(item => item.id === items[0]);
    setCurrentItem(product)
    console.log(product)
    setIsModalVisible(true)
  }

  // Handle Add Product Modal
  const handleAddProductModal = () => {
    setIsAddProductModalVisible(true)
  }

  // Handle modal close and reset form for Details Modal
  const handleCloseDetailsModal = () => {
    setIsModalVisible(false)
    setCurrentItem(null)
    formRef.current.resetFields(); // Reset the form fields
  }

  // Handle modal close and reset form for Add Product Modal
  const handleCloseAddProductModal = () => {
    setIsAddProductModalVisible(false)
    addProductFormRef.current.resetFields(); // Reset the form fields
  }

  // Handle Update and Delete actions
  const handleUpdate = () => {
    console.log('Updating item:', currentItem)
    setIsModalVisible(false)
  }

  const handleDelete = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xoá sản phẩm này?',
      content: `Sản phẩm "${currentItem.name}" sẽ bị xoá vĩnh viễn.`,
      centered: true,
      onOk: () => {
        console.log('Deleting item:', currentItem);
        setIsModalVisible(false);
        
      },
      onCancel: () => {
        console.log('Delete canceled');
      },
    });
  }

  const columns = [
    {
      name: "id",
      label: "Mã SP"
    },
    {
      name: "name",
      label: "Tên SP"
    },
    {
      name: "store",
      label: "Tên cửa hàng"
    },
    {
      name: "category",
      label: "Danh mục"
    },
    {
      name: "price",
      label: "Giá"
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

  const data = [
    {
      id: 1,
      name: "Giày thể thao Nike Air Max",
      store: "Cửa hàng 11",
      category: "Giày dép",
      price: "2,000,000 VNĐ",
      amount: 50,
      mota: "Giày thể thao Nike Air Max chính hãng, thiết kế thoải mái, độ bền cao.",
    },
    {
      id: 2,
      name: "Giày sandal Adidas",
      store: "Cửa hàng 2",
      category: "Giày dép",
      price: "1,500,000 VNĐ",
      amount: 120,
      mota: "Sandal Adidas với thiết kế thoáng khí, dễ chịu khi mang lâu.",
    },
    {
      id: 3,
      name: "Giày bóng rổ Puma",
      store: "Cửa hàng 3",
      category: "Giày dép",
      price: "2,500,000 VNĐ",
      amount: 75,
      mota: "Giày bóng rổ Puma, mang lại sự thoải mái và độ bám tốt khi thi đấu.",
    },
    {
      id: 4,
      name: "Giày boots Converse",
      store: "Cửa hàng 4",
      category: "Giày dép",
      price: "1,800,000 VNĐ",
      amount: 60,
      mota: "Giày boots Converse mang phong cách cá tính, thích hợp cho mùa thu đông.",
    },
    {
      id: 5,
      name: "Giày chạy bộ Asics Gel",
      store: "Cửa hàng 5",
      category: "Giày dép",
      price: "3,000,000 VNĐ",
      amount: 80,
      mota: "Giày chạy bộ Asics Gel với công nghệ giảm shock, tăng hiệu quả vận động.",
    },
    {
      id: 6,
      name: "Giày lười Vans",
      store: "Cửa hàng 6",
      category: "Giày dép",
      price: "1,200,000 VNĐ",
      amount: 150,
      mota: "Giày lười Vans, thiết kế đơn giản, dễ phối đồ và thoải mái khi sử dụng.",
    },
    {
      id: 7,
      name: "Giày thể thao New Balance",
      store: "Cửa hàng 7",
      category: "Giày dép",
      price: "2,200,000 VNĐ",
      amount: 95,
      mota: "Giày thể thao New Balance, sự kết hợp hoàn hảo giữa công nghệ và thời trang.",
    },
  ];

  return (
    <div className='p-4'>
      <div className='flex gap-2 text-sm text-gray-500 pb-4'>
        <a className='text-black' href='/admin/home'>BK Admin</a> 
        <div className='text-black'>&gt;</div>
        <div>Quản lý sản phẩm</div>
      </div>
      <div className='flex justify-between pb-4'>
        <Button type="primary" onClick={handleAddProductModal}>Thêm sản phẩm</Button>
      </div>
      <div className='pt-4 rounded-lg shadow-lg bg-white'>
        <TableComponent columns={columns} data={data} title="Danh sách sản phẩm" />
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
                <Form.Item label="Chọn cửa hàng" name="store" initialValue={currentItem.store}>
                  <Select placeholder='Vui lòng chọn cửa hàng'>
                    <Option value="store1">Cửa hàng 1</Option>
                    <Option value="store2">Cửa hàng 2</Option>
                    <Option value="store3">Cửa hàng 3</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Chọn danh mục" name="category" initialValue={currentItem.category}>
                  <Select placeholder='Vui lòng chọn danh mục'>
                    <Option value="electronics">Điện tử</Option>
                    <Option value="clothing">Thời trang</Option>
                    <Option value="furniture">Nội thất</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Tên sản phẩm" name="nameproduct" initialValue={currentItem.name}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Giá" name="price" initialValue={currentItem.price}>
                  <Input placeholder='Vui lòng nhập giá' />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Số lượng" name="amount" initialValue={currentItem.amount}>
              <Input placeholder='Vui lòng nhập số lượng' />
            </Form.Item>
            <Form.Item label="Mô tả" name="description" initialValue={currentItem.mota}>
              <Input.TextArea placeholder='Vui lòng nhập mô tả' />
            </Form.Item>
            <div className='flex justify-end gap-3'>
            <Button type="dashed" htmlType="submit" onClick={handleDelete}>Xoá</Button>
              <Button type="primary" htmlType="submit" onClick={handleUpdate}>Cập nhật</Button>
            </div>
          </Form>
        )}
      </Modal>

      {/* Add Product Modal */}
      <Modal
        title="Thêm sản phẩm"
        visible={isAddProductModalVisible}
        onCancel={handleCloseAddProductModal}
        centered={true}
        footer={null}
      >
        <Form ref={addProductFormRef} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Chọn cửa hàng" name="store">
                <Select placeholder='Vui lòng chọn cửa hàng'>
                  <Option value="store1">Cửa hàng 1</Option>
                  <Option value="store2">Cửa hàng 2</Option>
                  <Option value="store3">Cửa hàng 3</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chọn danh mục" name="category">
                <Select placeholder='Vui lòng chọn danh mục'>
                  <Option value="electronics">Điện tử</Option>
                  <Option value="clothing">Thời trang</Option>
                  <Option value="furniture">Nội thất</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tên sản phẩm" name="nameproduct">
                <Input placeholder='Vui lòng nhập tên sản phẩm' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giá" name="price">
                <Input placeholder='Vui lòng nhập giá' />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Số lượng" name="amount">
            <Input placeholder='Vui lòng nhập số lượng' />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea placeholder='Vui lòng nhập mô tả' />
          </Form.Item>
          <div className='flex justify-end'>
            <Button type="primary" htmlType="submit">Thêm</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageProductPage;
