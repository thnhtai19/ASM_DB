import React from 'react'
import TableComponent from '../../components/TableComponent/TableComponent'
import {Button} from 'antd'

const ManageOrder = () => {

  function showModal(item){
    console.log(item)
  }
  
  const columns = [
    {
      name: "id",
      label: "Id"
    },
    {
      name: "name",
      label: "Tên"
    },
    {
      name: "age",
      label: "Tuổi"
    },
    {
      name: "email",
      label: "Địa chỉ"
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
    { id: 1, name: "Nguyễn Văn A", age: 25, email: "nguyenvana@gmail.com", cc: 'cc' },
    { id: 2, name: "Trần Thị B", age: 30, email: "tranthib@gmail.com" },
    { id: 3, name: "Phạm Văn C", age: 28, email: "phamvanc@gmail.com" },
    { id: 4, name: "Lê Thị D", age: 22, email: "lethid@gmail.com" },
    { id: 5, name: "Võ Văn E", age: 35, email: "vovane@gmail.com" },
    { id: 6, name: "Hoàng Thị F", age: 27, email: "hoangthif@gmail.com" },
  ];


  return (
    <div className='p-4'>
      <div className='flex gap-2 text-sm text-gray-500 pb-4'>
        <a className='text-black' href='/admin/home'>BK Admin</a> 
        <div className='text-black'>&gt;</div>
        <a>Quản lý đơn hàng</a>
      </div>
      <div className='pt-4 rounded-lg shadow-lg bg-white'>
        <TableComponent columns={columns} data={data} title="Danh sách đơn hàng" />
      </div>  
    </div>
  )
}

export default ManageOrder