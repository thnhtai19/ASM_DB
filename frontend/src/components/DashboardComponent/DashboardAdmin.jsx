import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import SlidebaAdminComponent from '../SlidebaAdminComponent/SlidebarAdminComponent';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import { WrapperContainer, Overlay } from './style';

const DashboardAdmin = ({pageIndex}) => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <WrapperContainer isOpen={isOpen}>
      <div className='wrap-sidebar' ref={sidebarRef}>
        <SlidebaAdminComponent curentpage={pageIndex} />
      </div>
      <div className='wrap-main'>
        <div className='wrap-header-admin'>
          <HeaderComponent isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>
        <div className='wrap-page'>
          <Outlet />
        </div>
      </div>
      {isOpen && <Overlay onClick={() => setIsOpen(false)} />}
    </WrapperContainer>
  );
};

export default DashboardAdmin;
