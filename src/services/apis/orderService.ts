import axiosClient from "~/services";
import {toQueryString} from "~/commons/funcs/optionConvert";

const orderService = {
    createOrderUser: (body: {
        userAddress: {
            customerName: string;
            phone: string;
            address: string;
            type: number;
            isDefault: boolean | null;
            fullAddress: string;
        } | null;
        voucherCode: string;
        paymentMethod: number;
        id: number;
    }, cancelToken?: any) => {
        return axiosClient.post('/api/v1/Order/create-order-user', body, {cancelToken})
    },
    vnPayCallback: (query: string, cancelToken?: any) => {
        return axiosClient.get(`/api/v1/Order/callback/vn-pay?${query}`, {cancelToken})
    },
    getListUserOrders: (query: {
        type: number;
        isPaging: boolean;
        page: number;
        size: number;
    }, cancelToken?: any) => {
        return axiosClient.get(`/api/v1/Order/list-order${toQueryString(query)}`, {cancelToken})
    },
    cancelOrder(orderId: number, cancelToken?: any) {
        return axiosClient.post(`/api/v1/Order/cancel-order/${orderId}`,{}, {cancelToken})
    }
}

export default orderService;