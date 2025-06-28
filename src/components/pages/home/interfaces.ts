import {IBaseDto} from "~/commons/interfaces";

export interface IProductCartDto extends IBaseDto {
    name: string;
    price: number;
    starRate: number;
    imageUrl: string;
    bestSell: number;
    remarked: number;
}