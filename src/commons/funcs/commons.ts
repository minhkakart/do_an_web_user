import {TypeDiscount} from "~/constants/config/enum";
import {IProductCartDto} from "~/components/pages/home/interfaces";

export const calculatePrice = (itemPrice: number, quantity: number, toppings: number[], discount: number, discountType: TypeDiscount, listTopping: IProductCartDto[]): number => {
    let priceTopping = toppings.reduce((total, toppingId) => {
        const topping = listTopping.find(t => t.id === toppingId);
        return total + (topping ? topping.price : 0);
    }, 0);

    if (discountType === TypeDiscount.Absolute) {
        return Math.max(0, (itemPrice + priceTopping - discount) * quantity);
    } else {
        const discountAmount = (itemPrice * discount) / 100;
        return Math.max(0, (itemPrice + priceTopping - discountAmount) * quantity);
    }
}
