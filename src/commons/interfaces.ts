import React from "react";

export interface IBaseResponse<T> {
    error: IBaseResponseError;
    data: T;
}

export interface IBaseResponseError {
    code: number;
    message: string;
}

export interface IPageResponse<T> {
    items: T[];
    pagination: IPagination;
}

export interface IPagination {
    totalCount: number;
    totalPage: number;
}

export interface IBaseDto {
    id: number;
}

export interface IToken {
    accessToken: string;
    refreshToken: string;
}

export interface IUserData {
    id: string;
    fullName: string;
    avatar: string | null;
    role: number;
}

export interface IApiRequest {
    api: () => any;
    onError?: (err: any) => void;
    setLoadingState?: (state: any) => void;
    msgSuccess?: string;
    showMessageSuccess?: boolean;
    showMessageFailed?: boolean;
}


export interface IPersonalNav {
    id: string,
    name: string,
    icon: any,
    component: React.ElementType,
}

export interface IProvinceDto extends IBaseDetailAddressUnitDto {
    phoneCode: number;
}

export interface IDistrictDto extends IBaseDetailAddressUnitDto {
    provinceCode: number;
    provinceId: number;
}

export interface IWardDto extends IBaseDetailAddressUnitDto {
    districtCode: number;
    districtId: number;
}

interface IBaseDetailAddressUnitDto extends IBaseDto {
    code: number;
    name: string;
    codename: string;
    divisionType: string;
}

export interface IFormProps {
    queryKeys: number[];
    onClose?: () => void;
}