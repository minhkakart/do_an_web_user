import axios, {AxiosResponse} from "axios";
import {store} from "~/redux/store";
import {IApiRequest, IBaseResponse, IToken} from "~/commons/interfaces";
import {toastError, toastInfo, toastSuccess} from "~/commons/funcs/toast";
import {logout, setIsLoggedIn, setIsTokenValid, setToken} from "~/redux/appReducer";
import config from "../../postcss.config.mjs";
import {setItemStorage} from "~/commons/funcs/localStorage";
import {KEY_STORAGE_TOKEN} from "~/constants/config";

const axiosClient = axios.create({
    headers: {
        'content-type': 'application/json',
    },
    baseURL: process.env.NEXT_PUBLIC_API,
    timeout: 60 * 1000,
    timeoutErrorMessage: 'Timeout error request',
});

axiosClient.interceptors.request.use(async (config) => {
    const token = store.getState().token?.accessToken;

    if (!!token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
});

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error: any) => {
        if (error.response && error.response.data) {
            throw error.response.data.error;
        }
        if (!axios.isCancel(error)) throw error;
    }
);
export default axiosClient;

export const apiRequest: any = async (
    {
        api,
        setLoadingState,
        msgSuccess = 'Thành công',
        showMessageSuccess = false,
        showMessageFailed = false,
        onError = (err) => {
        }
    }: IApiRequest) => {
    try {
        if (!!setLoadingState) {
            setLoadingState(() => true);
        }
        let response: IBaseResponse<any> = await api();

        // Success
        if (response.error.code === 1) {
            showMessageSuccess && toastSuccess({msg: msgSuccess});
            return response.data === null ? true : response.data;
        }

        if (response.error.code === -440) {
            const refreshToken = store.getState().token?.refreshToken;
            const axiosResponse = await axios.post(process.env.NEXT_PUBLIC_API + '/api/v1/Auth/refresh', {}, {
                headers: {
                    Authorization: 'Bearer ' + refreshToken
                }
            })
            const refreshResult: IBaseResponse<IToken> = axiosResponse.data;
            // Success
            if (refreshResult.error.code === 1) {
                store.dispatch(setToken(refreshResult.data))
                setItemStorage(KEY_STORAGE_TOKEN, refreshResult.data);
                // Retry the original API request with the new token
                return await apiRequest({
                    api,
                    setLoadingState,
                    msgSuccess,
                    showMessageSuccess,
                    showMessageFailed,
                    onError
                })
            } else {
                throw refreshResult.error;
            }
        }

        // Custom error
        showMessageFailed && toastError({msg: response.error.message || "Có lỗi xảy ra"});
    } catch (error: any) {
        onError && onError(error);

        // Axios error
        if (error.code == 'ERR_NETWORK' || error.code == 'ECONNABORTED') {
            console.log('Lỗi kết nối internet')
            showMessageFailed && toastInfo({msg: 'Lỗi kết nối internet'});
            // throw error;
        }

        // Custom error
        switch (error.status || error.code) {
            case 401:
                showMessageFailed && toastError({msg: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'});
                store.dispatch(logout());
                store.dispatch(setIsLoggedIn(false));
                store.dispatch(setIsTokenValid(false));
                break;
            case 403:
                showMessageFailed && toastError({msg: 'Bạn không có quyền truy cập'});
                break;
            case 500:
                showMessageFailed && toastError({msg: 'Lỗi hệ thống, vui lòng thử lại sau'});
                break;
            default:
                showMessageFailed && toastError({msg: error.message || 'Có lỗi xảy ra'});
                break;
        }
        // throw error;
    } finally {
        if (!!setLoadingState) {
            setLoadingState(() => false);
        }
    }
}