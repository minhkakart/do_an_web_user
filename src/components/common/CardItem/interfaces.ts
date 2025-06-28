import {IProductCartDto} from "~/components/pages/home/interfaces";
import {IBaseDto} from "~/commons/interfaces";

export interface IProductWithSizesDto extends IProductCartDto {
    sizePrices: IProductSizePriceDto[];
    toppings: IProductToppingDto[];
}

export interface IProductSizePriceDto extends IBaseDto {
    product: IProductCartDto;
    size: ISizeDto;
    price: number;
}

export interface ISizeDto extends IBaseDto {
    name: string;
}

export interface IProductToppingDto extends IBaseDto {
    name: string,
    price: number,
    isAvailable: number,
    type: number,
}