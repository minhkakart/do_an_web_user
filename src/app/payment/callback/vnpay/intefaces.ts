export interface IOrderPaymentResponseDto {
    responseCode: string;
    message: string;
    transactionStatus: string;
    bankCode: string;
    terminalID: string;
    transactionNo: number | null;
    orderId: number | null;
    amount: number | null;
}