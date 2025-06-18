import {IBaseDto} from "~/commons/interfaces";

export interface IProductCartDto extends IBaseDto {
    name: string;
    price: number;
    discount: number | null;
    discountType: number | null;
    starRate: number;
    imageUrl: string;
    bestSell: number;
    remarked: number;
}