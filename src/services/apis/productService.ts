import axiosClient from "~/services";
import {toQueryString} from "~/commons/funcs/optionConvert";

const productService = {
    getProducts: async (params: {
        keyword: string;
        type: number | null;
        special: number | null;
        categoryId: number | null;
        page: number;
        size: number;
    }, tokenAxios?: any) => {
        return axiosClient.get('/api/v1/Product/list-products' + toQueryString(params), {
            cancelToken: tokenAxios,
        });
    },
    getProductWithSizes: async (productId: number, tokenAxios?: any) => {
        return axiosClient.get(`/api/v1/Product/product-with-sizes/${productId}`, {
            cancelToken: tokenAxios,
        })
    }
}

export default productService;