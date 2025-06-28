import {IProductCartDto} from "~/components/pages/home/interfaces";

export const calculatePrice = (itemPrice: number, quantity: number, toppings: number[], listTopping: IProductCartDto[]): number => {
    let priceTopping = toppings.reduce((total, toppingId) => {
        const topping = listTopping.find(t => t.id === toppingId);
        return total + (topping ? topping.price : 0);
    }, 0);

    return (itemPrice + priceTopping) * quantity;
}
