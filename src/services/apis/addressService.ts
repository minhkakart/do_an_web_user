import axiosClient from "~/services";

const addressService = {
    getProvinces: async (tokenAxios?: any) => {
        return axiosClient.get('/api/v1/Address/provinces', {
            cancelToken: tokenAxios,
        });
    },
    getDistricts: async (provinceId: number, tokenAxios?: any) => {
        return axiosClient.get(`/api/v1/Address/provinces/${provinceId}/districts`, {
            cancelToken: tokenAxios,
        });
    },
    getWards: async (districtId: number, tokenAxios?: any) => {
        return axiosClient.get(`/api/v1/Address/districts/${districtId}/wards`, {
            cancelToken: tokenAxios,
        });
    },
}

export default addressService;