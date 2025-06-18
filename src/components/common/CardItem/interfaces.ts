import {IProductCartDto} from "~/components/pages/home/interfaces";
import {IBaseDto} from "~/commons/interfaces";

export interface IProductWithSizesDto extends IProductCartDto {
    sizePrices: IProductSizePriceDto[];
}

export interface IProductSizePriceDto extends IBaseDto{
    size: ISizeDto;
    price: number;
}

export interface ISizeDto extends IBaseDto {
    name: string;
}