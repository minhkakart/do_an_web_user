import axiosClient from "~/services";

const useService = {
    getProfile: (
        tokenAxios?: any
    ) => {
        return axiosClient.get('/api/v1/User/profile', {
            cancelToken: tokenAxios,
        });
    },
    updateAvatar: (file: any, tokenAxios?: any) => {
        const dataFile = new FormData();
        dataFile.append(`FileData`, file);

        return axiosClient.patch('/api/v1/User/profile/avatar', dataFile, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'text/plain',
            },
            cancelToken: tokenAxios,
        });
    },
    updateProfile: (data: {
        fullName: string;
        email: string | null;
        gender: number;
        phone: string | null;
        birthday: string | null;
    }, tokenAxios?: any) => {
        return axiosClient.patch('/api/v1/User/profile', data, {
            cancelToken: tokenAxios,
        });
    },
    getAccount: (tokenAxios?: any) => {
        return axiosClient.get('/api/v1/User/profile/account', {
            cancelToken: tokenAxios,
        });
    },
    changePassword: (data: {
        oldPassword: string;
        newPassword: string;
    }, tokenAxios?: any) => {
        return axiosClient.post('/api/v1/User/profile/change-password', data, {
            cancelToken: tokenAxios,
        });
    },
}

export default useService;