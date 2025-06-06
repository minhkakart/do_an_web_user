import IconToastifyCustom from "~/components/utils/IconToastifyCustom";
import {ToastOptions} from "react-toastify";

export const ToastCustom : {
    toastSuccess:  ToastOptions<any>,
    toastInfo:  ToastOptions<any>,
    toastWarn:  ToastOptions<any>,
    toastError:  ToastOptions<any>,
    toastText:  ToastOptions<any>,
} = {
    toastSuccess: {
        autoClose: 2000,
        hideProgressBar: true,
        position: 'top-center',
        closeButton: true,
        className: 'toastify-custom-success',
        icon: IconToastifyCustom({type: 'success'}),
    },
    toastInfo: {
        autoClose: 2000,
        hideProgressBar: true,
        position: 'top-center',
        closeButton: true,
        className: 'toastify-custom-info',
        icon: IconToastifyCustom({type: 'info'}),
    },
    toastWarn: {
        autoClose: 2000,
        hideProgressBar: true,
        position: 'top-center',
        closeButton: true,
        className: 'toastify-custom-warn',
        icon: IconToastifyCustom({type: 'warn'}),
    },
    toastError: {
        autoClose: 2000,
        hideProgressBar: true,
        position: 'top-center',
        closeButton: true,
        className: 'toastify-custom-error',
        icon: IconToastifyCustom({type: 'error'}),
    },
    toastText: {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        className: 'toastify-custom',
        icon: IconToastifyCustom({type: 'info'}),
    }
}
