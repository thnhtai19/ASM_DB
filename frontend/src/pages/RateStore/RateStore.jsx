import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import TableComponent from '../../components/TableComponent/TableComponent'
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const RateStore = () => {

  const [danh_sach_cua_hang, set_danh_sach_cua_hang] = useState([])
  const [Loading, SetLoading] = useState([])

  const fetchStores = async () => {
    SetLoading(true)
    try {
      const res = await axios.get(`${apiUrl}admin/getAllStoreRatings`, {
        withCredentials: true,
      });
      console.log(res.status)
      if(res.status === 200){
        set_danh_sach_cua_hang(res.data.Danh_sach_cua_hang.reverse());
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
    fetchStores();
  }, []);

  
  const columns = [
    {
      name: "MaCuaHang",
      label: "Mã cửa hàng"
    },
    {
      name: "TenCuaHang",
      label: "Tên cửa hàng"
    },
    {
      name: "TenNguoiBan",
      label: "Tên người bán"
    },
    {
      name: "SoSaoTrungBinh",
      label: "Số sao trung bình"
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
        <div>Đánh giá cửa hàng</div>
      </div>
      <div className='pt-4 rounded-lg shadow-lg bg-white'>
        <TableComponent columns={columns} data={danh_sach_cua_hang} title="Danh sách đánh giá cửa hàng" />
      </div>
    </div>
  );
}

export default RateStore;
