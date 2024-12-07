import React, {useState} from 'react'
import {
  WrapperContainer
} from './style'
import { 
  BellOutlined,
  SearchOutlined,
  AlignLeftOutlined, 
  LogoutOutlined, 
  UserOutlined, 
  SafetyCertificateOutlined, 
  ShopOutlined,
  ShoppingOutlined,
  InboxOutlined,

} from '@ant-design/icons';
import { Input, Dropdown, Menu, Badge } from 'antd';
import user from '../../assets/user.png';
import { Link } from "react-router-dom";
import axios from "axios";


const { Search } = Input;

const HeaderComponent = ({ isOpen, setIsOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationStatus, setNotificationStatus] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogout = async () => {
    try {
        await axios.post(apiUrl + 'auth/log_out');
        localStorage.clear();
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
    }
  };

  const truncateText = (text, maxLength) => {
      if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
      }
      return text;
  };


  const menu = (
    <Menu style={{ width: '250px', maxHeight: '300px' }}>
      <div style={{ marginLeft: '15px', padding: '10px 0' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Trần Thành Tài
        </div>
        <div style={{ fontSize: '11px', color: '#444' }}>tai.tranthanh@hcmut.edu.vn</div>
      </div>

      <Menu.Item key="0">
        <Link to="/myaccount" style={{ color: '#444' }} >
          <div style={{ display: 'flex', gap: '10px' }}>
            <UserOutlined />
            <div style={{ fontSize: '14px' }}>Trang cá nhân</div>
          </div>
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link to="/history" style={{ color: '#444' }} >
          <div style={{ display: 'flex', gap: '10px' }}>
            <ShopOutlined />
            <div style={{ fontSize: '14px' }}>Lịch sử in tài liệu</div>
          </div>
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/admin/home" style={{ color: '#444' }} >
          <div style={{ display: 'flex', gap: '10px' }}>
            <SafetyCertificateOutlined />
            <div style={{ fontSize: '14px' }}>Quản trị hệ thống</div>
          </div>
        </Link>
      </Menu.Item>
      <div style={{ width: '250px', borderBottom: '1.5px solid #F5F5F5', margin: '5px 0' }} />
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