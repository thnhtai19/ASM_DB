import styled from "styled-components";

export const WrapperContainer = styled.div`
    width: 250px;
    background-color: #262A2E;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    transition: width 0.3s;
    height: 100vh;

    .wrap-logo {
        height: 80px;
        justify-content: center;
        padding: 0 20px;
    }

    .wrap-logo-container {
        position: relative;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        border-bottom: 1px solid #fff;
        cursor: pointer;
    }

    .brand-name {
        color: #fff;
        font-size: 21px;
        font-weight: bold;
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .wrap-name {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
        color: #fff;
    }

    .wrap-item-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 30px 20px;
        font-size: 13px;
        cursor: pointer;

        :hover {
            background-color: #343B48;
        }
    }

    .wrap-item {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        height: 50px;
        border-radius: 15px;
        background-color: #FFFFF;
        justify-content: left;
        padding-left: 20px;
        transition: padding-left 0.3s;

        img {
            width: 20px;
        }

        div {
            display: block;
            white-space: nowrap; 
            overflow: hidden;
            text-overflow: ellipsis;
            color: #FFFF;
        }
    }

    .select-item {
        background-color: #343B48;
    }

    .wrap-user {
        height: 80px;
        width: 100%;
        justify-content: center;
        padding: 0 20px;
    }

    .wrap-user-container {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        border-top: 1px solid #EFF1F3;
    }
    
    .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px; 
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        padding: 10px;
        transition: background-color 0.3s ease;
    }
    
    .icon-wrapper:hover {
        background-color: #ddd;
    }

    .icon {
        color: #444;
        font-weight: bold;
        font-size: 20px;
        margin: 0;
        transition: transform 0.3s ease;
    }

    .icon.rotated {
        transform: rotate(180deg);
    }

    @media(max-width: 1200px){
        .icon-wrapper{
            display: none;
        }
    }

`
