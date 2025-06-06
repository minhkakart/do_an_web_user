import {IUserAddressCreateRequest} from "../FormCreateAddress/interfaces";
import {IBaseDto} from "~/commons/interfaces";

export interface IUserAddressUpdateRequest extends IUserAddressCreateRequest {
    id: number;
}

export interface IUserAddressDetailDto extends IBaseDto {
    customerName: string;
    phone: string;
    address: string;
    type: number;
    isDefault: boolean | null;
    geoPosition: string;
    fullAddress: IAddressDto;
}
interface IAddressDto {
    province: IBaseDetailAddressUnitDto;
    district: IBaseDetailAddressUnitDto;
    ward: IBaseDetailAddressUnitDto;
}
interface IBaseDetailAddressUnitDto extends IBaseDto {
    code: number;
    name: string;
    codename: string;
    divisionType: string;
}