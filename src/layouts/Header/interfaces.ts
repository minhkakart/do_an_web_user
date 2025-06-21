import {IBaseDto} from "~/commons/interfaces";

export interface ICartDto extends IBaseDto{
    productSizeId: number;
    quantity: number;
    toppingIds: number[];
    price: number;
}
export interface IUserCartDto {
    listCart: ICartDto[];
    totalPrice: number;
    totalItem: number;
}