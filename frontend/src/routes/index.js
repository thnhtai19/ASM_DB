import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import ManageProductPage from "../pages/ManageProductPage/ManageProductPage"
import ManageOrder from "../pages/ManageOrder/ManageOrder"
import LoginPage from "../pages/LoginPage/LoginPage"
import RateStore from "../pages/RateStore/RateStore"
import StaticSalePage from "../pages/StaticSalePage/StaticSalePage"
import ShipmentHistory from "../pages/ShipmentHistory/ShipmentHistory"


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
        path: '/admin/static_sale',
        page: StaticSalePage,
        isShowDashboardAdmin: true,
        pageIndex: 4,
    },
    {
        path: '/admin/rate_store',
        page: RateStore,
        isShowDashboardAdmin: true,
        pageIndex: 5,
    },
    {
        path: '/admin/shipment_history',
        page: ShipmentHistory,
        isShowDashboardAdmin: true,
        pageIndex: 6,
    },
    {
        path: '*',
        page: NotFoundPage
    }
]