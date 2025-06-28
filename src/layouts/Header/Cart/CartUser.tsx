'use client'
import {AiOutlineShoppingCart} from "react-icons/ai";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import cartService from "~/services/apis/cartService";
import {ICartDto, IUserCartDto} from "~/layouts/Header/interfaces";
import {ProductType, QueryKey, TypeDiscount} from "~/constants/config/enum";
import PositionContainer from "~/components/common/PositionContainer";
import {IFormProps, IPageResponse} from "~/commons/interfaces";
import React, {useEffect, useState} from "react";
import {RiShoppingBasket2Line} from "react-icons/ri";
import productService from "~/services/apis/productService";
import {IProductWithSizesDto} from "~/components/common/CardItem/interfaces";
import Image from "next/image";
import {resourceUrl} from "~/commons/funcs/optionConvert";
import {FaRegTrashAlt} from "react-icons/fa";
import clsx from "clsx";
import {convertCoin} from "~/commons/funcs/convertCoin";
import Loading from "~/components/common/Loading";
import {useDebounce} from "~/commons/hooks/useDebounce";
import {IProductCartDto} from "~/components/pages/home/interfaces";
import Link from "next/link";
import {Paths} from "~/constants/config";

function CartUser() {
    const [openForm, setOpenForm] = useState(false);

    const {data: userCartDto} = useQuery({
        queryFn: () => apiRequest({
            api: () => cartService.getUserCart(),
        }),
        select(data: IUserCartDto) {
            return data;
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
                    className="absolute text-sm text-white bg-red-600 rounded-full top-[calc(-10%)] left-[calc(-20%)] w-[16px] h-[16px] flex items-center justify-center">{userCartDto?.totalItem}</span>
            </div>
            <PositionContainer
                open={openForm}
                onClose={() => setOpenForm(false)}
            >
                <FormCartUser
                    cartData={userCartDto!}
                    queryKeys={[QueryKey.cartUser]}
                    onClose={() => setOpenForm(false)}
                />
            </PositionContainer>
        </>
    );
}

export default CartUser;

interface IFormCartUserProps extends IFormProps {
    cartData: IUserCartDto
}

function FormCartUser({queryKeys, onClose, cartData}: IFormCartUserProps) {
    return (
        <>
            <div className="w-[500px] max-h-screen min-h-screen bg-white flex flex-col gap-3">
                <div className="flex flex-col flex-1 gap-3 justify-start px-2 py-4">
                    <div className="flex flex-row items-start justify-start gap-2">
                        <RiShoppingBasket2Line style={{width: 32, height: 32}}/>
                        <h1 className="text-3xl uppercase font-semibold">Giỏ hàng</h1>
                    </div>
                    <div className="flex flex-col flex-1 max-h-[calc(100vh-200px)] overflow-y-scroll">
                        {cartData.listCart.length === 0 && (
                            <div className="flex items-center justify-center text-gray-500 text-lg">
                                Giỏ hàng trống
                            </div>
                        )}
                        {cartData.listCart.length !== 0 && cartData.listCart.map((item, index) => (
                            <CartItem key={index} item={item}/>
                        ))}
                    </div>
                    <div className="flex justify-between items-center text-xl">
                        <p>Tổng tiền ({cartData.totalItem}):</p>
                        <p>{convertCoin(cartData.totalPrice)} VNĐ</p>
                    </div>
                </div>
                {cartData.listCart.length === 0 ?
                    <></>
                    :
                    <Link
                        href={Paths.checkout}
                        className="flex justify-center items-center text-white! text-lg bg-green-600 cursor-pointer py-4 hover:bg-green-700">
                        Mua hàng
                    </Link>
                }
            </div>
        </>
    );
}

function CartItem({item}: { item: ICartDto }) {
    const queryClient = useQueryClient();
    const [formCartItem, setFormCartItem] = useState<ICartDto>(item);
    const [allowUpdate, setAllowUpdate] = useState<boolean>(false);

    const {data: cartProductItem, isFetched: loadedItem} = useQuery({
        queryFn: () => apiRequest({
            api: () => productService.getProductWithSizesByProductSize(item.productSizeId)
        }),
        select(data: IProductWithSizesDto) {
            return data;
        },
        queryKey: [QueryKey.cartProductItem, item],
    });

    const {data: listTopping} = useQuery({
        queryFn: async () => {
            return await apiRequest({
                api: async () => productService.getProducts({
                    page: 0,
                    size: 0,
                    categoryId: null,
                    keyword: '',
                    special: null,
                    type: ProductType.Topping,
                    isPaging: false
                })
            })
        },
        select(data: IPageResponse<IProductCartDto>) {
            if (!!data) {
                return data;
            }
            return {items: [], pagination: {totalCount: 0, totalPage: 0}} as IPageResponse<IProductCartDto>;
        },
        queryKey: [QueryKey.topping],
    })

    const updateCartItemFn = useMutation({
        mutationFn: () => apiRequest({
            api: () => cartService.updateCartItem(formCartItem)
        }),
        async onSuccess() {
            await queryClient.invalidateQueries({queryKey: [QueryKey.cartUser]});
        },
    })

    const debouncedUpdate = useDebounce({
        fn: () => updateCartItemFn.mutate(),
        delay: 500,
    });

    useEffect(() => {
        if (allowUpdate) {
            debouncedUpdate();
            setAllowUpdate(false);
        }
    }, [formCartItem, allowUpdate]);

    const removeCartItem = useMutation({
        mutationFn: (itemId: number) => apiRequest({
            api: () => cartService.removeFromCart(itemId),
        }),
        async onSuccess() {
            await queryClient.invalidateQueries({queryKey: [QueryKey.cartUser]})
        }
    })

    return (
        <>
            <Loading loading={removeCartItem.isPending || updateCartItemFn.isPending}/>
            <div className="[&+&]:border-t border-gray-300 flex flex-row py-4">
                <div className="flex items-start justify-center">
                    <Image src={resourceUrl(cartProductItem?.imageUrl)} alt="" width={100} height={100}
                           objectFit='contain'/>
                </div>
                <div className="flex flex-1 flex-col px-4">
                    <div className="flex flex-col flex-1 items-start justify-start w-full gap-3">
                        <h1 className="text-lg font-semibold mb-3">{cartProductItem?.name}</h1>
                        <div className="flex flex-row flex-wrap gap-1 cursor-pointer">
                            <p>Chọn size:</p>
                            {cartProductItem?.sizePrices.map((sizePrice) => {
                                return (
                                    <div
                                        key={sizePrice.id}
                                        onClick={() => {
                                            setAllowUpdate(true);
                                            setFormCartItem({
                                                ...formCartItem,
                                                productSizeId: sizePrice.id
                                            })
                                        }}
                                        className={clsx("w-[72px] rounded-sm border border-gray-400 flex items-center justify-center select-none", {
                                            'border-red-400! bg-red-400 text-white': formCartItem.productSizeId === sizePrice.id,
                                        })}>
                                        {sizePrice.size.name}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex flex-row flex-wrap gap-1">
                            <p>Số lượng:</p>
                            <div className="flex gap-4">
                                <div
                                    onClick={() => {
                                        if (formCartItem.quantity > 1) {
                                            setAllowUpdate(true);
                                            setFormCartItem({
                                                ...formCartItem,
                                                quantity: formCartItem.quantity - 1
                                            });
                                        }
                                    }}
                                    className="text-white text-xl! cursor-pointer px-2 bg-red-500 select-none">
                                    -
                                </div>
                                <p>{formCartItem.quantity}</p>
                                <div
                                    onClick={() => {
                                        setAllowUpdate(true);
                                        setFormCartItem({
                                            ...formCartItem,
                                            quantity: formCartItem.quantity + 1
                                        });
                                    }}
                                    className="text-white text-xl! cursor-pointer px-2 bg-red-500 select-none">
                                    +
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>Đơn
                                giá: {convertCoin((cartProductItem?.price ?? 0) + (cartProductItem?.sizePrices.find(x => x.id === formCartItem.productSizeId)?.price ?? 0))}VNĐ</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p>Chọn topping: </p>
                            {listTopping?.items.map((toppingItem) => (
                                <>
                                    <div className="flex flex-row gap-1 justify-start items-center">
                                        <input
                                            checked={formCartItem.toppingIds.includes(toppingItem.id)}
                                            onChange={() => {
                                                setAllowUpdate(true);
                                                const toppingIds = [...formCartItem.toppingIds];
                                                if (toppingIds.includes(toppingItem.id)) {
                                                    toppingIds.splice(toppingIds.indexOf(toppingItem.id), 1);
                                                } else {
                                                    toppingIds.push(toppingItem.id);
                                                }
                                                setFormCartItem({
                                                    ...formCartItem,
                                                    toppingIds: toppingIds
                                                });
                                            }}
                                            type="checkbox" name="topping"
                                            id={"topping_" + formCartItem.id + "_" + toppingItem.id}/>
                                        <label htmlFor={"topping_" + formCartItem.id + "_" + toppingItem.id}>
                                            {toppingItem.name}: +{convertCoin(toppingItem.price)}VNĐ
                                        </label>
                                    </div>
                                </>
                            ))}
                        </div>
                        <div>
                            <p>Thành
                                tiền: {convertCoin(item.price)}VNĐ</p>
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => removeCartItem.mutate(item.id)}
                    className="flex items-center justify-center cursor-pointer">
                    <FaRegTrashAlt style={{color: "#EE3E3E", width: 32, height: 32}}/>
                </div>
            </div>
        </>
    )
}