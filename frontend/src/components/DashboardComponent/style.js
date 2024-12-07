import styled from "styled-components";

export const WrapperContainer = styled.div`
  display: flex;
  overflow-x: hidden;
  
  .wrap-sidebar {
    width: 250px;
    position: fixed;
    z-index: 100;
    height: 100vh;
    transform: translateX(0);
    opacity: 1;
    visibility: visible;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  }

  .wrap-main {
    margin-left: 250px;
    flex: 1;
    height: 100vh;
    transition: margin-left 0.3s ease-in-out;
  }

  .wrap-header {
    position: fixed;
    top: 0;
    left: 250px;
    right: 0;
    height: 80px;
    z-index: 1000;
    background-color: #F7F9FB;
    transition: left 0.3s ease-in-out;
  }
  
  .wrap-header-admin {
    position: fixed;
    top: 0;
    left: 250px;
    right: 0;
    height: 80px;
    z-index: 1000;
    background-color: #fff;
    transition: left 0.3s ease-in-out;
    border-bottom: 1px solid #EFF1F3;
  }

  .wrap-page {
    padding-top: 80px;
    background-color: #F7F9FB;
    min-height: 100vh;
  }

   @media (min-width: 1200px) {
    .wrap-main {
      overflow-x: auto;
    }
  }

  @media (max-width: 1200px) {
    .wrap-sidebar {
      transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
      opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
      visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
      z-index: 1010;
    }

    .wrap-main {
      margin-left: 0;
      overflow-x: hidden;
    }

    .wrap-header {
      left: 0;
    }

    .wrap-header-admin {
      left: 0;
    }
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(38, 42, 46, 0.5);
  z-index: 1005;
`;
