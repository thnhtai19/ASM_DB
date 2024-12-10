import React, { useState } from 'react';
import axios from 'axios';
import {message} from 'antd'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;

  const isLoggedIn = sessionStorage.getItem("isLogin") === "true";

  if(isLoggedIn){
    window.location.href = '/admin/product'
  }


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}admin/login`, {
        email: username,
        matkhau: password
      });

      if(response.data.message === 'Admin đăng nhập thành công'){
        message.success('Đăng nhập thành công!');
        sessionStorage.setItem("isLogin", true);
        setTimeout(() => {
          window.location.href = '/admin/product'
        }, 2000);
      }else{
        message.error('Sai tài khoản hoặc mật khẩu!');
      }
    } catch (err) {
        message.error(err.response.data.error)
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Đăng Nhập</h2>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">Tên người dùng</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên người dùng"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage
