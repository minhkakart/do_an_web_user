import {IBaseDto} from "~/commons/interfaces";

export interface ICategoryDto extends IBaseDto {
    name: string;
    description: string;
}