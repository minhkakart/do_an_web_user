import {IBaseDto} from "~/commons/interfaces";
import {IProductCartDto} from "~/components/pages/home/interfaces";
import {IProductToppingDto, ISizeDto} from "~/components/common/CardItem/interfaces";

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

export interface IUserAddressDto extends IBaseDto {
    customerName: string;
    phone: string;
    address: string;
    type: number;
    isDefault: boolean | null;
    fullAddress: string;
}

export interface IUserOrderDto extends IBaseDto {
    code: string;
    phoneNumber: string;
    shippingAddress: string;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    paymentMethod: number;
    status: number;
    paymentStatus: number;
    orderTime: string;
    createdAt: string;
    products: IOrderProductDto[];
}
interface IOrderProductDto extends IBaseDto {
    productSize: IProductSizeDto;
    toppings: IOrderProductToppingDto[];
    quantity: number;
    price: number;
}
interface IProductSizeDto extends IBaseDto {
    product: IProductCartDto;
    size: ISizeDto;
    price: number;
}
interface IOrderProductToppingDto extends IBaseDto {
    topping: IProductToppingDto;
    price: number;
}