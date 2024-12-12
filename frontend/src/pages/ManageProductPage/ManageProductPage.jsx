import React, { useState, useRef, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, Select, Spin, message } from 'antd'
import TableComponent from '../../components/TableComponent/TableComponent'
import axios from 'axios';

const { Option } = Select;

const apiUrl = process.env.REACT_APP_API_URL;

const ManageProductPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  const formRef = useRef(null); 
  const addProductFormRef = useRef(null);

  const [danh_sach_cua_hang, set_danh_sach_cua_hang] = useState([])
  const [danh_sach_danh_muc, set_danh_sach_danh_muc] = useState([])
  const [danh_sach_san_pham, set_danh_sach_san_pham] = useState([])
  const [Loading, SetLoading] = useState([])

  const fetchProducts = async () => {
    SetLoading(true)
    try {
      const res = await axios.get(`${apiUrl}product/list`, {
        withCredentials: true,
      });
      console.log(res.status)
      if(res.status === 200){
        set_danh_sach_cua_hang(res.data.Danh_sach_cua_hang);
        set_danh_sach_danh_muc(res.data.Danh_sach_danh_muc);
        set_danh_sach_san_pham(res.data.Danh_sach_san_pham.reverse());
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
    fetchProducts();
  }, []);




  function showModal(items) {
    const product = danh_sach_san_pham.find(item => item.id === items[0]);
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
    formRef.current.resetFields();
  }

  const handleCloseAddProductModal = () => {
    setIsAddProductModalVisible(false)
    addProductFormRef.current.resetFields();
  }

  const handleUpdate = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn cập nhật sản phẩm này?',
      centered: true,
      onOk: async () => {
        const formValues = formRef.current.getFieldsValue();
  
        try {
          const res = await axios.post(`${apiUrl}product/update`, 
            {
              'MaSanPham': currentItem.id,
              'MoTa': formValues.description,
              'Loai': formValues.loai,
              'TenSanPham': formValues.nameproduct,
              'MaDanhMuc': formValues.category,
              'MaCuaHang': formValues.store,
              'SoLuong': formValues.amount,
              'Gia': formValues.price
            }, 
            {
              withCredentials: true,
            }
          );
  
          if (res.status === 200) {
            const tencuahang = danh_sach_cua_hang.find(item => item.id === formValues.store);
            const tendanhmuc = danh_sach_danh_muc.find(item => item.id === formValues.category);
            set_danh_sach_san_pham((prev) => 
              prev.map((item) => 
                item.id === currentItem.id
                  ? { 
                      ...item, 
                      ...formValues,
                      Mo_Ta: formValues.description,
                      loai: formValues.loai,
                      Ten_Cua_Hang: tencuahang.Ten_Cua_Hang,
                      Ten_Danh_Muc: tendanhmuc.Ten_Danh_Muc,
                      Ma_Danh_Muc: formValues.category,
                      Ma_Cua_Hang: formValues.store,
                      Ten_San_Pham: formValues.nameproduct,
                      Gia: formValues.price,
                      So_Luong: formValues.amount,
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

  const handleAddProduct = async () => {
    try {
      // Lấy dữ liệu từ form
      const values = await addProductFormRef.current.validateFields();
      const newProduct = {
        MaCuaHang: values.store,
        MaDanhMuc: values.category,
        TenSanPham: values.nameproduct,
        Gia: values.price,
        Loai: values.loai,
        SoLuong: values.amount,
        MoTa: values.description,
      };
  
      const res = await axios.post(`${apiUrl}product/add`, newProduct, {
        withCredentials: true,
      });
  
      if (res.status === 200) {       
        message.success("Thêm sản phẩm thành công!");
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      } else {
        message.error("Đã xảy ra lỗi khi thêm sản phẩm.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      message.error("Vui lòng kiểm tra lại thông tin và thử lại.");
    }
  };
  
  
  

  const handleDelete = async () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xoá sản phẩm này?',
      content: `Sản phẩm "${currentItem.Ten_San_Pham}" sẽ bị xoá vĩnh viễn.`,
      centered: true,
      onOk: async () => {
        try {
          const res = await axios.post(`${apiUrl}product/delete`, {'MaSanPham': currentItem.id}, {
            withCredentials: true,
          });
  
          if (res.status === 200) {
            set_danh_sach_san_pham((prev) =>
              prev.filter((item) => item.id !== currentItem.id)
            );
            setIsModalVisible(false);
            message.success("Xoá sản phẩm thành công");
          }
        } catch (error) {
          console.error("Lỗi khi xoá sản phẩm:", error);
          message.error("Đã xảy ra lỗi khi xoá sản phẩm.");
        }
      },
      onCancel: () => {
        console.log("Delete canceled");
      },
    });
  };
  
  const columns = [
    {
      name: "id",
      label: "Mã SP"
    },
    {
      name: "Ten_San_Pham",
      label: "Tên SP"
    },
    {
      name: "Ten_Cua_Hang",
      label: "Tên cửa hàng"
    },
    {
      name: "Ten_Danh_Muc",
      label: "Danh mục"
    },
    {
      name: "Gia",
      label: "Giá",
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
        <div>Quản lý sản phẩm</div>
      </div>
      <div className='flex justify-between pb-4'>
        <Button type="primary" onClick={handleAddProductModal}>Thêm sản phẩm</Button>
      </div>
      <div className='pt-4 rounded-lg shadow-lg bg-white'>
        <TableComponent columns={columns} data={danh_sach_san_pham} title="Danh sách sản phẩm" />
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
                <Form.Item label="Chọn cửa hàng" name="store" initialValue={currentItem.Ma_Cua_Hang}>
                  <Select placeholder='Vui lòng chọn cửa hàng'>
                    {danh_sach_cua_hang.map((cuahang) => (
                      <Option key={cuahang.id} value={cuahang.id}>
                        {cuahang.Ten_Cua_Hang}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Chọn danh mục" name="category" initialValue={currentItem.Ma_Danh_Muc}>
                  <Select placeholder='Vui lòng chọn danh mục'>
                    {danh_sach_danh_muc.map((danhmuc) => (
                      <Option key={danhmuc.id} value={danhmuc.id}>
                        {danhmuc.Ten_Danh_Muc}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Tên sản phẩm" name="nameproduct" initialValue={currentItem.Ten_San_Pham}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Giá" name="price" initialValue={currentItem.Gia}>
                  <Input placeholder='Vui lòng nhập giá' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Loại" name="loai" initialValue={currentItem.loai}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Số lượng" name="amount" initialValue={currentItem.So_Luong}>
                  <Input placeholder='Vui lòng nhập số lượng' />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Mô tả" name="description" initialValue={currentItem.Mo_Ta}>
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
                  {danh_sach_cua_hang.map((cuahang) => (
                    <Option key={cuahang.id} value={cuahang.id}>
                      {cuahang.Ten_Cua_Hang}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chọn danh mục" name="category">
                <Select placeholder='Vui lòng chọn danh mục'>
                  {danh_sach_danh_muc.map((danhmuc) => (
                    <Option key={danhmuc.id} value={danhmuc.id}>
                      {danhmuc.Ten_Danh_Muc}
                    </Option>
                  ))}
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Loại" name="loai" >
                <Input placeholder='Vui lòng nhập loại'/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số lượng" name="amount">
                <Input placeholder='Vui lòng nhập số lượng' />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea placeholder='Vui lòng nhập mô tả' />
          </Form.Item>
          <div className='flex justify-end'>
            <Button type="primary" htmlType="submit" onClick={handleAddProduct}>Thêm</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageProductPage;
