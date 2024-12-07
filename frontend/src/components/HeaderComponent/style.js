import styled from "styled-components";


export const WrapperContainer = styled.div`
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    align-items: center;
    gap: 20px;


    .left-container{
        
    }

    .right-container{
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .wrap-button-con{
        padding-right: 15px;
        border-right: 1px solid #EFF1F3;
    }
    
    .wrap-button{
        border-radius: 15px;
        background-color: #0688B4;
        padding: 8px 10px;
        height: 100%;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
    }

    .wrap-search{
        width: 500px;
    }

    .wrap-outline{
        font-size: 20px;
        color: #444;
        display: none;
    }

    .wrap-slidebar{
        display: none;
    }

    @media(max-width: 1200px){
        .wrap-search{
            display: none;
        }

        .wrap-outline{
            display: flex;
        }
    }
`;