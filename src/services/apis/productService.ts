import axiosClient from "~/services";
import {toQueryString} from "~/commons/funcs/optionConvert";

const productService = {
    getProducts: async (params: {
        keyword: string;
        type: number | null;
        special: number | null;
        categoryIds: number[];
        page: number;
        size: number;
        isPaging: boolean;
    }, tokenAxios?: any) => {
        return axiosClient.post('/api/v1/Product/list-products', params, {
            cancelToken: tokenAxios,
        });
    },
    getProductWithSizes: async (productId: number, tokenAxios?: any) => {
        return axiosClient.get(`/api/v1/Product/product-with-sizes/${productId}`, {
            cancelToken: tokenAxios,
        })
    },
    getProductWithSizesByProductSize: async (productSizeId: number, tokenAxios?: any) => {
        return axiosClient.get(`/api/v1/Product/product-with-sizes-by-product-size/${productSizeId}`, {
            cancelToken: tokenAxios,
        })
    },
}

export default productService;