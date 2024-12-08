import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import ManageProductPage from "../pages/ManageProductPage/ManageProductPage"
import ManageOrder from "../pages/ManageOrder/ManageOrder"
import LoginPage from "../pages/LoginPage/LoginPage"
export const routes = [
    {
        path: '/',
        page: LoginPage,
    },
    {
        path: '/admin/product',
        page: ManageProductPage,
        isShowDashboardAdmin: true,
        pageIndex: 2,
    },
    {
        path: '/admin/order',
        page: ManageOrder,
        isShowDashboardAdmin: true,
        pageIndex: 3,
    },
    {
        path: '*',
        page: NotFoundPage
    }
]