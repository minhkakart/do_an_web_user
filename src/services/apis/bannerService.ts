import axiosClient from "~/services";

const bannerService = {
    getBanner: (
        tokenAxios?: any
    ) => {
        return axiosClient.get('/api/v1/Banner', {
            cancelToken: tokenAxios,
        });
    }
}

export default bannerService;