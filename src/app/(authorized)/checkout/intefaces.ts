import {IBaseDto} from "~/commons/interfaces";
import {IProductSizePriceDto, IProductToppingDto} from "~/components/common/CardItem/interfaces";
import {IUserAddressDto} from "~/app/(authorized)/personal/interfaces";

export interface ICheckoutProps{

}

export interface IUserCartDetailDto {
    listCart: ICartItem[];
    totalPrice: number;
}

export interface ICartItem extends IBaseDto {
    productSize: IProductSizePriceDto;
    toppings: IProductToppingDto[];
    quantity: number;
    price: number;
}

export interface IVoucherInfoDto {
    code: string;
    description: string;
    value: number;
    valueMax: number;
    discountType: number;
    message: string | null;
    isValid: boolean;
}

export interface ICreateOrderRequest {
    userAddress: IUserAddressDto | null;
    voucherCode: string;
    paymentMethod: number;
    id: number;
}