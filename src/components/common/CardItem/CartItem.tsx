'use client'
import React, {useCallback, useEffect, useState} from "react";
import {IProductCartDto} from "~/components/pages/home/interfaces";
import {resourceUrl} from "~/commons/funcs/optionConvert";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import cartService from "~/services/apis/cartService";
import Loading from "~/components/common/Loading";
import {QueryKey, TypeDiscount} from "~/constants/config/enum";
import {IFormProps} from "~/commons/interfaces";
import Popup from "~/components/common/Popup";
import productService from "~/services/apis/productService";
import {IProductWithSizesDto} from "~/components/common/CardItem/interfaces";
import Form, {FormContext} from "~/components/common/Form";
import Button from "~/components/common/Button";
import {FolderOpen} from "iconsax-react";
import Image from "next/image";
import clsx from "clsx";
import {convertCoin} from "~/commons/funcs/convertCoin";

export interface ICartItemProps {
    item: IProductCartDto
}

function CartItem({item}: ICartItemProps) {
    const [addToCartId, setAddToCartId] = useState<number | null>(null);

    return (
        <>
            <div
                className="bg-white rounded-xl shadow-md flex flex-col items-center p-4 transition-transform hover:scale-105 hover:cursor-pointer min-w-[18%] max-md:min-w-[45%] md:max-lg:min-w-[28%]"
            >
                <img
                    src={resourceUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-32 h-32 object-contain mb-3 rounded-lg"
                />
                <div className="font-semibold text-lg text-center mb-1">{item.name}</div>
                <div className="text-[#006f3c] font-bold text-base">{item.price.toLocaleString()}₫</div>
                <div className="btns flex flex-row gap-2 mt-3">
                    <div className="buy">
                        <button
                            className="bg-[#006f3c] text-white px-4 py-2 rounded-lg mt-2 hover:bg-[#005a32] transition-colors cursor-pointer">
                            Buy Now
                        </button>
                    </div>
                    <div className="add-to-cart">
                        <button
                            onClick={() => setAddToCartId(item.id)}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mt-2 hover:bg-gray-300 transition-colors cursor-pointer">
                            Add to Cart
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

export default CartItem;

interface ICartSelectionForm extends IFormProps {
    productId: number;
}

function CartSelectionForm(props: ICartSelectionForm) {
    const queryClient = useQueryClient();

    const [cartForm, setCartForm] = useState<{ productSizeId: number, quantity: number }>({
        productSizeId: 0,
        quantity: 1
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

    const calculatePrice = useCallback((itemPrice: number, quantity: number, discount: number, discountType: TypeDiscount): number => {
        if (discountType === TypeDiscount.Absolute) {
            return Math.max(0, (itemPrice - discount) * quantity);
        } else {
            const discountAmount = (itemPrice * discount) / 100;
            return Math.max(0, (itemPrice - discountAmount) * quantity);
        }
    }, [cartForm.productSizeId, cartForm.quantity]);

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
    }

    return (
        <>
            <Loading loading={addToCart.isPending}/>
            {/*<Form form={cartForm} setForm={setCartForm} onSubmit={() => {}}>*/}
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
                            <div>
                                <p>Đơn
                                    giá: {convertCoin((product?.price ?? 0) + (product?.sizePrices.find(x => x.id === cartForm.productSizeId)?.price ?? 0))}VNĐ</p>
                            </div>
                            <div>
                                <p>Giảm
                                    giá/món: {product?.discount}{product?.discountType === TypeDiscount.Absolute ? "VNĐ" : "%"}</p>
                            </div>
                            <div>
                                <p>Thành
                                    tiền: {convertCoin(calculatePrice((product?.price ?? 0) + (product?.sizePrices.find(x => x.id === cartForm.productSizeId)?.price ?? 0), cartForm.quantity, product?.discount ?? 0, product?.discountType ?? TypeDiscount.Percent))}VNĐ</p>
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
            {/*</Form>*/}
        </>
    );
}