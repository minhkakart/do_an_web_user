import axiosClient from "~/services";

const voucherService = {
    checkVoucher: (voucherCode: string, orderPrice: number, axiosToken?: any) => {
        return axiosClient.get(`/api/v1/Voucher/check-voucher?voucherCode=${voucherCode}&orderPrice=${orderPrice}`, {cancelToken: axiosToken});
    }
}

export default voucherService;