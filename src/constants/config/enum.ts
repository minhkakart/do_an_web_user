export enum QueryKey {
    tableCategory,
    tableProduct,
    tableEmployee,
    tableVoucher,
    tableBanner,
    profile,
    account,
    listAddress,
    listProvince,
    listDistrict,
    listWard,
    getDetailAddress,
    bestSellers,
    remarked,
    listBanner,
    cartUser,
    productWithSize,
    cartProductItem,
    topping,
    cartUserDetail,
    listUserOrder,
    listProductSearch,
    getListProducts,
    allCategory,
    detailOrder,
}

export enum UserRole {
    Customer = 0,
    Employee,
    Admin
}

export enum TypeGender {
    Male,
    Female
}

export enum TypeDiscount {
    Percent = 1,
    Absolute
}

export enum BooleanType {
    False = 0,
    True
}

export enum VoucherState {
    NotUse = 0,
    InUse = 1
}

export enum TypeAddress {
    Home = 0,
    Work
}

export enum ProductSpecial {
    Both = 0,
    BestSeller = 1,
    Remarked = 2
}

export enum ProductType {
    Main = 1,
    Topping
}

export enum PaymentMethod {
    Cash = 1,
    Momo,
    VnPay
}

export enum OrderStatus {
    Pending = 0,
    Approved = 1,
    Making = 2,
    Delivering = 3,
    Finished = 4,
    Cancelled = 5,
    UserCanceled = 6,
}

export const VnPayResponseCode = {
    Success: '00',
    UserCancelled: '24',
    Error: '97',
    Timeout: '99',
    Fail: '01',
    Invalid: '02',
    InvalidSignature: '03',
    InvalidTransaction: '04',
    InvalidAmount: '05',
    InvalidBankCode: '06',
    InvalidOrderId: '07',
    InvalidTransactionNo: '08',
}