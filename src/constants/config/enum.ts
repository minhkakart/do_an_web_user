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