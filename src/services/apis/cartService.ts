import axiosClient from "~/services";

const cartService = {
    getUserCart: (tokenAxios?: any) => {
        return axiosClient.get('/api/v1/Cart', {cancelToken: tokenAxios});
    },
    addToCart: (body: { productSizeId: number, quantity: number }, tokenAxios?: any) => {
        return axiosClient.post(`/api/v1/Cart/add-to-cart`, body, {cancelToken: tokenAxios});
    },
}

export default cartService;