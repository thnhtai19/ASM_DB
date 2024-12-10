import React from 'react'
import {
  WrapperContainer
} from './style'
import { 
  SearchOutlined,
  AlignLeftOutlined, 
  LogoutOutlined, 

} from '@ant-design/icons';
import { Input, Dropdown, Menu } from 'antd';
import user from '../../assets/user.png';
import axios from "axios";


const { Search } = Input;

const HeaderComponent = ({ isOpen, setIsOpen }) => {

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogout = async () => {
    try {
        await axios.post(apiUrl + 'admin/logout');
        sessionStorage.clear();
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
    }
  };



  const menu = (
    <Menu style={{ width: '250px', maxHeight: '300px' }}>
      <div style={{ marginLeft: '15px', padding: '10px 0' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Trần Thành Tài
        </div>
        <div style={{ fontSize: '11px', color: '#444' }}>tai.tranthanh@hcmut.edu.vn</div>
      </div>

      <Menu.Item key="3">
        <div style={{ display: 'flex', gap: '10px' }} onClick={handleLogout}>
          <LogoutOutlined />
          <div style={{ color: '#444' }}>Đăng xuất</div>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <WrapperContainer>
      <div className='wrap-outline'>
        <AlignLeftOutlined style={{ cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)} />
        <SearchOutlined style={{ cursor: 'pointer', paddingLeft: '20px' }} />
      </div>
      <div className='left-container'>
        <Search placeholder="Tìm kiếm bất cứ thứ gì..." className='wrap-search' size='large' />
      </div>
      <div className='right-container'>
        <Dropdown overlay={menu} trigger={['click']} overlayStyle={{ paddingTop: '10px' }} >
          <img src={user} alt='user' width="40px" style={{ cursor: 'pointer' }} />
        </Dropdown>
      </div>
    </WrapperContainer>
  )
}

export default HeaderComponent