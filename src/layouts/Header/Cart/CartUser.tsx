'use client'
import {AiOutlineShoppingCart} from "react-icons/ai";
import {useQuery} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import cartService from "~/services/apis/cartService";
import {ICartDto} from "~/layouts/Header/interfaces";
import {QueryKey} from "~/constants/config/enum";
import PositionContainer from "~/components/common/PositionContainer";
import {IFormProps} from "~/commons/interfaces";
import {useState} from "react";

function CartUser() {
    const [openForm, setOpenForm] = useState(false);

    const {data: carts = []} = useQuery({
        queryFn: () => apiRequest({
            api: () => cartService.getUserCart(),
        }),
        select(data: ICartDto[]) {
            if (!!data) {
                return data;
            }
            return [];
        },
        queryKey: [QueryKey.cartUser]
    })

    return (
        <>
            <div
                onClick={() => setOpenForm(true)}
                className="relative cursor-pointer">
                <AiOutlineShoppingCart
                    style={{
                        width: 32,
                        height: 32,
                        color: 'black',
                        transform: 'scaleX(-1)',
                        transformOrigin: 'center center'
                    }}
                />
                <span
                    className="absolute text-sm text-white bg-red-600 rounded-full top-[calc(-10%)] left-[calc(-20%)] w-[16px] h-[16px] flex items-center justify-center">{carts.length}</span>
            </div>
            <PositionContainer
                open={openForm}
                onClose={() => setOpenForm(false)}
            >
                <FormCartUser
                    queryKeys={[QueryKey.tableProduct]}
                    onClose={() => setOpenForm(false)}
                />
            </PositionContainer>
        </>
    );
}

export default CartUser;

function FormCartUser(prop: IFormProps) {

    return (
        <>
            <div className="w-[500px] h-full bg-white">

            </div>
        </>
    );
}