export interface IUserAddressCreateRequest {
    customerName: string;
    phone: string;
    provinceId: number;
    districtId: number;
    wardId: number;
    customAddress: string;
    geoPosition: string | null;
    type: number;
    isDefault: number;
}