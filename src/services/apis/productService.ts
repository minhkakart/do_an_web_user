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
        isPaging: boolean;
    }, tokenAxios?: any) => {
        return axiosClient.get('/api/v1/Product/list-products' + toQueryString(params), {
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