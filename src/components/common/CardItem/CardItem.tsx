'use client'
import React, {useEffect, useState} from "react";
import {IProductCartDto} from "~/components/pages/home/interfaces";
import {resourceUrl} from "~/commons/funcs/optionConvert";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import cartService from "~/services/apis/cartService";
import Loading from "~/components/common/Loading";
import {ProductType, QueryKey} from "~/constants/config/enum";
import {IFormProps, IPageResponse} from "~/commons/interfaces";
import Popup from "~/components/common/Popup";
import productService from "~/services/apis/productService";
import {IProductWithSizesDto} from "~/components/common/CardItem/interfaces";
import Image from "next/image";
import clsx from "clsx";
import {convertCoin} from "~/commons/funcs/convertCoin";
import {calculatePrice} from "~/commons/funcs/commons";

export interface ICartItemProps {
    item: IProductCartDto
}

function CardItem({item}: ICartItemProps) {
    const [addToCartId, setAddToCartId] = useState<number | null>(null);

    return (
        <>
            <div
                className="bg-white rounded-xl shadow-md flex flex-col items-center p-4 transition-transform hover:scale-105 hover:cursor-pointer min-w-[200px] w-full max-w-[240px]"
            >
                <Image
                    src={resourceUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-32 h-32 object-contain mb-3 rounded-lg"
                />
                <div className="font-semibold text-lg text-center mb-1">{item.name}</div>
                <div className="text-[#006f3c] font-bold text-base flex-1">{item.price.toLocaleString()}₫</div>
                <div className="btns flex flex-row gap-2 mt-3">
                    <div className="add-to-cart">
                        <button
                            onClick={() => setAddToCartId(item.id)}
                            className="bg-gray-200 text-gray-800 px-10 py-2 rounded-lg mt-2 hover:bg-gray-300 transition-colors cursor-pointer select-none">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>

            <Popup open={!!addToCartId} onClose={() => setAddToCartId(null)}>
                <CartSelectionForm productId={addToCartId!} queryKeys={[QueryKey.cartUser]}
                                   onClose={() => setAddToCartId(null)}/>
            </Popup>
        </>
    );
}

export default CardItem;

interface ICartSelectionForm extends IFormProps {
    productId: number;
}

function CartSelectionForm(props: ICartSelectionForm) {
    const queryClient = useQueryClient();

    const [cartForm, setCartForm] = useState<{ productSizeId: number, quantity: number, toppingIds: number[] }>({
        productSizeId: 0,
        quantity: 1,
        toppingIds: []
    });

    const addToCart = useMutation({
        mutationFn: () => apiRequest({
            api: async () => cartService.addToCart(cartForm),
            msgSuccess: "Thêm sản phẩm vào giỏ hàng thành công",
            showMessageSuccess: true,
            showMessageFailed: true
        }),
        async onSuccess() {
            await queryClient.invalidateQueries({queryKey: [QueryKey.cartUser]})
            props.onClose?.();
        }
    })

    const {data: product, isFetched: loadedProduct} = useQuery({
        queryFn: async () => apiRequest({
            api: async () => productService.getProductWithSizes(props.productId)
        }),
        select(data: IProductWithSizesDto) {
            return data;
        },
        queryKey: [QueryKey.productWithSize],
    })
    const {data: listTopping} = useQuery({
        queryFn: async () => {
            return await apiRequest({
                api: async () => productService.getProducts({
                    page: 0,
                    size: 0,
                    categoryIds: [],
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

    useEffect(() => {
        if (loadedProduct) {
            setCartForm({
                ...cartForm,
                productSizeId: product?.sizePrices?.[0].id || 0
            })
        }
    }, [loadedProduct, product]);

    const handleSubmit = () => {
        addToCart.mutate();
        // console.log("Submitting cart form:", cartForm);
    }

    return (
        <>
            <Loading loading={addToCart.isPending}/>
            <div className="w-[640px] bg-white p-2.5">
                <div className="flex flex-row gap-4">
                    <div className="flex flex-1 items-center justify-center">
                        <Image src={resourceUrl(product?.imageUrl)} alt="" width={150} height={250}
                               objectFit="contain"/>
                    </div>
                    <div className="flex flex-col flex-1 items-start justify-start w-full gap-3">
                        <h1 className="text-3xl font-semibold mb-8">{product?.name}</h1>
                        <div className="flex flex-row flex-wrap gap-1 cursor-pointer">
                            <p>Chọn size:</p>
                            {product?.sizePrices.map((sizePrice) => {
                                return (
                                    <div
                                        key={sizePrice.id}
                                        onClick={() => setCartForm({
                                            ...cartForm,
                                            productSizeId: sizePrice.id
                                        })}
                                        className={clsx("w-[72px] rounded-sm border border-gray-400 flex items-center justify-center", {
                                            'border-red-400! bg-red-400 text-white': cartForm.productSizeId === sizePrice.id,
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
                                        if (cartForm.quantity > 1) {
                                            setCartForm({
                                                ...cartForm,
                                                quantity: cartForm.quantity - 1
                                            });
                                        }
                                    }}
                                    className="text-white text-xl! cursor-pointer px-2 bg-red-500">-
                                </div>
                                <p>{cartForm.quantity}</p>
                                <div
                                    onClick={() => {
                                        setCartForm({
                                            ...cartForm,
                                            quantity: cartForm.quantity + 1
                                        });
                                    }}
                                    className="text-white text-xl! cursor-pointer px-2 bg-red-500">+
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p>Chọn topping: </p>
                            {listTopping?.items.map((toppingItem) => (
                                <>
                                    <div className="flex flex-row gap-1 justify-start items-center">
                                        <input
                                            checked={cartForm.toppingIds.includes(toppingItem.id)}
                                            onChange={() => {
                                                const toppingIds = [...cartForm.toppingIds];
                                                if (toppingIds.includes(toppingItem.id)) {
                                                    toppingIds.splice(toppingIds.indexOf(toppingItem.id), 1);
                                                } else {
                                                    toppingIds.push(toppingItem.id);
                                                }
                                                setCartForm({
                                                    ...cartForm,
                                                    toppingIds: toppingIds
                                                });
                                            }}
                                            type="checkbox" name="topping" id={"topping_" + toppingItem.id}/>
                                        <label htmlFor={"topping_" + toppingItem.id}>
                                            {toppingItem.name}: +{convertCoin(toppingItem.price)}VNĐ
                                        </label>
                                    </div>
                                </>
                            ))}
                        </div>
                        <div>
                            <p>Đơn
                                giá: {convertCoin((product?.price ?? 0) + (product?.sizePrices.find(x => x.id === cartForm.productSizeId)?.price ?? 0))}VNĐ</p>
                        </div>
                        <div>
                            <p>Thành
                                tiền: {convertCoin(calculatePrice((product?.price ?? 0) + (product?.sizePrices.find(x => x.id === cartForm.productSizeId)?.price ?? 0), cartForm.quantity, cartForm.toppingIds, listTopping?.items ?? []))}VNĐ</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-[10px] mt-6">
                    <button
                        className="w-1/2 uppercase text-white text-xl! cursor-pointer py-2 bg-red-500 hover:bg-red-400"
                        onClick={props.onClose}>
                        Hủy
                    </button>
                    <button disabled={!loadedProduct}
                            onClick={handleSubmit}
                            className="w-1/2 uppercase text-white text-xl! cursor-pointer py-2 bg-green-500 hover:bg-green-400">
                        Thêm
                    </button>
                </div>
            </div>
        </>
    );
}