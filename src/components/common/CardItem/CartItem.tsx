import React from "react";

export interface ICartItemProps {
    item: {
        id: number,
        name: string,
        price: number,
        imageUrl: string
    },
    key: React.Key
}

function CartItem({item}: ICartItemProps) {
    return (
        <div
            className="bg-white rounded-xl shadow-md flex flex-col items-center p-4 transition-transform hover:scale-105 hover:cursor-pointer min-w-[18%] max-md:min-w-[45%] md:max-lg:min-w-[28%]"
        >
            <img
                src={item.imageUrl}
                alt={item.name}
                className="w-32 h-32 object-contain mb-3 rounded-lg"
            />
            <div className="font-semibold text-lg text-center mb-1">{item.name}</div>
            <div className="text-[#006f3c] font-bold text-base">{item.price.toLocaleString()}₫</div>
            <div className="btns flex flex-row gap-2 mt-3">
                <div className="buy">
                    <button
                        className="bg-[#006f3c] text-white px-4 py-2 rounded-lg mt-2 hover:bg-[#005a32] transition-colors">
                        Buy Now
                    </button>
                </div>
                <div className="add-to-cart">
                    <button
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mt-2 hover:bg-gray-300 transition-colors">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;