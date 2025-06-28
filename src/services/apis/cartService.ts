import axiosClient from "~/services";

const cartService = {
    getUserCart: (tokenAxios?: any) => {
        return axiosClient.get('/api/v1/Cart', {cancelToken: tokenAxios});
    },
    getUserCartDetail: (tokenAxios?: any) => {
        return axiosClient.get('/api/v1/Cart/detail', {cancelToken: tokenAxios});
    },
    addToCart: (body: { productSizeId: number, quantity: number, toppingIds: number[] }, tokenAxios?: any) => {
        return axiosClient.post(`/api/v1/Cart/add-to-cart`, body, {cancelToken: tokenAxios});
    },
    removeFromCart: (cartId: number, tokenAxios?: any) => {
        return axiosClient.delete(`/api/v1/Cart/${cartId}`, {cancelToken: tokenAxios});
    },
    updateCartItem: (body: {
        id: number; productSizeId: number;
        quantity: number;
    }, tokenAxios?: any) => {
        return axiosClient.put(`/api/v1/Cart/update-cart`, body, {cancelToken: tokenAxios});
    },
}

export default cartService;