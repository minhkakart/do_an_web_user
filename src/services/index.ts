import axios, {AxiosResponse} from "axios";
import {store} from "~/redux/store";
import {IApiRequest, IBaseResponse, IToken} from "~/commons/interfaces";
import {ToastCustom} from "~/commons/funcs/toast";
import {logout, setIsCheckingToken, setIsLoggedIn, setIsTokenValid, setToken} from "~/redux/appReducer";
import {setItemStorage} from "~/commons/funcs/localStorage";
import {KEY_STORAGE_TOKEN} from "~/constants/config";
import {toast} from "react-toastify";

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

export const apiRequest = async (
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
            showMessageSuccess && toast.success(msgSuccess, ToastCustom.toastSuccess);
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
                response = await api();
                // Success
                if (response.error.code === 1) {
                    showMessageSuccess && toast.success(msgSuccess, ToastCustom.toastSuccess);
                    return response.data === null ? true : response.data;
                } else {
                    throw response.error;
                }
            } else {
                throw refreshResult.error;
            }
        }

        // Custom error
        showMessageFailed && toast.error((response.error.message || "Có lỗi xảy ra"), ToastCustom.toastError);
    } catch (error: any) {
        onError && onError(error);

        // Axios error
        if (error.code == 'ERR_NETWORK' || error.code == 'ECONNABORTED') {
            showMessageFailed && toast.info('Lỗi kết nối internet', ToastCustom.toastInfo);
            // throw error;
        }

        // Custom error
        switch (error.status || error.code) {
            case 401:
                showMessageFailed && toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại', ToastCustom.toastError);
                store.dispatch(logout());
                store.dispatch(setIsCheckingToken(false));
                store.dispatch(setIsLoggedIn(false));
                store.dispatch(setIsTokenValid(false));
                break;
            case 403:
                showMessageFailed && toast.error('Bạn không có quyền truy cập', ToastCustom.toastError);
                break;
            case 500:
                showMessageFailed && toast.error('Lỗi hệ thống, vui lòng thử lại sau', ToastCustom.toastError);
                break;
            default:
                showMessageFailed && toast.error((error.message || 'Có lỗi xảy ra'), ToastCustom.toastError);
                break;
        }
        // throw error;
    } finally {
        if (!!setLoadingState) {
            setLoadingState(() => false);
        }
    }
}