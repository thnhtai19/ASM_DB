import React from 'react';
import './style.css'; 
import { Helmet, HelmetProvider } from 'react-helmet-async';

const NotFoundPage = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Trang không tồn tại - BK SSPS</title>
      </Helmet>
      <div className="not-found-container">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Xin lỗi! Trang mà bạn đang tìm không tồn tại.</p>
        <a href="/admin/product" className="not-found-link">Trở về trang chủ</a>
      </div>
    </HelmetProvider>
  );
}

export default NotFoundPage;