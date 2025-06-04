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