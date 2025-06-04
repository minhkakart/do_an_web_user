import {IBaseDto} from "~/commons/interfaces";

export interface IUserProfile extends IUserInfo {
    email: string;
    phone: string;
    gender: number;
    birthday: string;
}
interface IUserInfo extends IBaseDto {
    fullName: string;
    avatar: string;
    userRole: number;
}
export interface IUpdateProfileRequest {
    fullName: string;
    email: string | null;
    phone: string | null;
    gender: number;
    birthday: string | null;
}