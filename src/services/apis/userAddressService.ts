import axiosClient from "~/services";

const userAddressService = {
    getAddresses: async (tokenAxios?: any) => {
        return axiosClient.get('/api/v1/UserAddress', {
            cancelToken: tokenAxios,
        })
    },
    getDetailAddresses: async (addressId: number, tokenAxios?: any) => {
        return axiosClient.get(`/api/v1/UserAddress/${addressId}`, {
            cancelToken: tokenAxios,
        })
    },
    createAddress: async (data: {
        customerName: string;
        phone: string;
        provinceId: number;
        districtId: number;
        wardId: number;
        customAddress: string;
        geoPosition: string | null;
        type: number;
        isDefault: number;
    }, tokenAxios?: any) => {
        return axiosClient.post('/api/v1/UserAddress', data, {
            cancelToken: tokenAxios,
        })
    },
    updateAddress: async (data: {
        id: number;
        customerName: string;
        phone: string;
        provinceId: number;
        districtId: number;
        wardId: number;
        customAddress: string;
        geoPosition: string | null;
        type: number;
        isDefault: number;
    }, tokenAxios?: any) => {
        return axiosClient.put(`/api/v1/UserAddress`, data, {
            cancelToken: tokenAxios,
        })
    },
    deleteAddress: async (addressId: number, tokenAxios?: any) => {
        return axiosClient.delete(`/api/v1/UserAddress/${addressId}`, {
            cancelToken: tokenAxios,
        })
    },
}

export default userAddressService
