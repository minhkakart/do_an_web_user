import axiosClient from "~/services";

const authService = {
    login: (
        data: {
            userName: string;
            password: string;
            type: number;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Auth/login`, data, {
            cancelToken: tokenAxios,
        });
    },
    logout: (tokenAxios?: any) => {
        return axiosClient.post(`/api/v1/Auth/logout`, {}, {
            cancelToken: tokenAxios,
        });
    },
    checkToken: (tokenAxios?: any) => {
        return axiosClient.post(`/api/v1/Auth/check-token`, {}, {
            cancelToken: tokenAxios,
        });
    },
    register: (data: {
        fullname: string,
        username: string,
        email: string,
        phone: string,
        password: string
    }, tokenAxios?: any) => {
        return axiosClient.post(`/api/v1/Auth/register`, data, {
            cancelToken: tokenAxios,
        });
    }
};

export default authService;