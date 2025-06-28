'use client';
import React, {useCallback, useEffect} from 'react';
import {ICheckoutProps, ICreateOrderRequest, IUserCartDetailDto, IVoucherInfoDto} from "./intefaces";
import {useMutation, useQuery} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import cartService from "~/services/apis/cartService";
import {PaymentMethod, QueryKey, TypeAddress, TypeDiscount} from "~/constants/config/enum";
import Image from "next/image";
import {resourceUrl} from "~/commons/funcs/optionConvert";
import {convertCoin} from "~/commons/funcs/convertCoin";
import {IUserAddressDto} from "~/app/(authorized)/personal/interfaces";
import userAddressService from "~/services/apis/userAddressService";
import {BsGeoAlt} from "react-icons/bs";
import {FaAngleRight} from "react-icons/fa6";
import Popup from "~/components/common/Popup/Popup";
import {IFormProps} from "~/commons/interfaces";
import clsx from "clsx";
import {IoTicketOutline} from "react-icons/io5";
import {MdOutlinePayments} from "react-icons/md";
import {PiMoneyWavy} from "react-icons/pi";
import images from "~/constants/images/images";
import voucherService from "~/services/apis/voucherService";
import {RiMoneyDollarCircleLine} from "react-icons/ri";
import orderService from "~/services/apis/orderService";
import Loading from "~/components/common/Loading";
import {useRouter} from "next/navigation";

function Page({}: ICheckoutProps) {
    const router = useRouter()

    const [changingAddress, setChangingAddress] = React.useState<boolean>(false);
    const [voucherCode, setVoucherCode] = React.useState<string>('');
    const [voucherInfo, setVoucherInfo] = React.useState<IVoucherInfoDto | null>(null);

    const [formCreateOrderUser, setFormCreateOrderUser] = React.useState<ICreateOrderRequest>({
        userAddress: {
            id: 0,
            customerName: '',
            phone: '',
            address: '',
            type: TypeAddress.Home, // Default to home address
            isDefault: null,
            fullAddress: ''
        },
        voucherCode: '',
        paymentMethod: PaymentMethod.Cash,
        id: 0
    })

    const {data: cartDetails} = useQuery({
        queryFn: () => apiRequest({
            api: () => cartService.getUserCartDetail()
        }),
        select(data: IUserCartDetailDto) {
            return data
        },
        queryKey: [QueryKey.cartUserDetail, QueryKey.cartUser]
    })

    const {data: listAddress = [], isFetched: loadedListAddress} = useQuery<IUserAddressDto[]>({
        queryFn: () => apiRequest({
            api: async () => userAddressService.getAddresses()
        }),
        select(data) {
            return data;
        },
        queryKey: [QueryKey.listAddress]
    })
    useEffect(() => {
        const defaultAddress = listAddress.find(address => address.isDefault);
        if (defaultAddress) {
            setFormCreateOrderUser({
                ...formCreateOrderUser,
                userAddress: defaultAddress
            });
        }
    }, [loadedListAddress]);

    const checkVoucher = useMutation({
        mutationFn: () => apiRequest({
            api: () => voucherService.checkVoucher(voucherCode, cartDetails?.totalPrice ?? 0),
            showMessageFailed: true,
        }),
        onSuccess(data: IVoucherInfoDto) {
            setVoucherInfo(data);
            setFormCreateOrderUser({
                ...formCreateOrderUser,
                voucherCode: data.code
            });
        }
    })

    const createOrderUser = useMutation({
        mutationFn: () => apiRequest({
            api: () => orderService.createOrderUser(formCreateOrderUser),
            showMessageFailed: true,
        }),
        onSuccess(data) {
            // noinspection TypeScriptValidateTypes
            router.replace(data.redirectUrl);
        },
    })

    const calculateDiscountedPrice = useCallback(() => {
        if (!cartDetails || !voucherInfo || !voucherInfo.isValid) {
            return 0;
        }

        let discount = 0;
        if (voucherInfo.discountType === TypeDiscount.Percent) { // Percentage discount
            discount = (cartDetails.totalPrice * voucherInfo.value) / 100;
        } else if (voucherInfo.discountType === TypeDiscount.Absolute) { // Fixed amount discount
            discount = voucherInfo.value;
        } else {
            return 0;
        }

        return Math.max(Math.min(discount, voucherInfo.valueMax), 0);
    }, [cartDetails, voucherInfo]);

    return (
        <>
            <Loading loading={createOrderUser.isPending}/>
            <div className="flex flex-col w-full gap-4 px-8">
                <h1 className="items-start mt-8">Thanh toán</h1>
                <div className="flex flex-row gap-3 min-h-[400px] flex-wrap">
                    <div
                        className="flex flex-1 flex-col justify-start border border-green-600 rounded-lg min-w-[360px]">
                        <div
                            className="text-lg text-center font-semibold h-fit px-4 py-2 bg-green-600 rounded-t-[6px] text-white">
                            Thông tin đơn hàng
                        </div>
                        <div className="flex flex-col flex-1 px-4 py-2 gap-2">
                            {cartDetails?.listCart.map((item) => (
                                <div key={item.id}
                                     className="flex flex-row justify-between gap-4 p-2 rounded-md border border-gray-300">
                                    <div className="flex items-start">
                                        <Image src={resourceUrl(item?.productSize?.product?.imageUrl)} alt=""
                                               width={100}
                                               height={100} objectFit="contain"/>
                                    </div>
                                    <div className="flex flex-col flex-1 items-start justify-start w-full gap-3">
                                        <div className="flex flex-row flex-wrap gap-1 cursor-pointer">
                                            <h1 className="text-xl font-semibold">{item?.productSize?.product?.name}</h1>
                                            <div
                                                className="rounded-sm flex items-center justify-center bg-red-400 text-white px-3">
                                                {item.productSize.size.name}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium">{convertCoin(item.productSize.product.price + item.productSize.price)}VNĐ</p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="font-medium">Topping: </p>
                                            {item.toppings.map((toppingItem) => (
                                                <div key={toppingItem.id}
                                                     className="flex flex-row gap-1 justify-start items-center pl-8">
                                                    <p className="font-medium">
                                                        {toppingItem.name}:
                                                    </p>
                                                    <p>+{convertCoin(toppingItem.price)}VNĐ</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex flex-row flex-wrap gap-1">
                                            <p className="font-medium">Số lượng:</p>
                                            <p>{item.quantity}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Thành
                                                tiền: {convertCoin(item.price)}VNĐ</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/*<div*/}
                        {/*    className="flex items-center justify-start  border-t border-green-600 px-4 py-2 font-semibold text-lg text-green-600">*/}
                        {/*    Tổng tiền: {convertCoin(cartDetails?.totalPrice ?? 0)}VNĐ*/}
                        {/*</div>*/}
                        <div className="text-lg font-semibold px-4 py-2 bg-green-600 rounded-b-[6px] text-white h-11">

                        </div>
                    </div>
                    <div
                        className="flex flex-1 flex-col justify-start border border-green-600 rounded-lg min-w-[360px]">
                        <div
                            className="text-lg text-center font-semibold h-fit px-4 py-2 bg-green-600 rounded-t-[6px] text-white">
                            Thông tin thanh toán
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col flex-1 px-4 py-2 gap-2">
                                <div className="p-2 rounded-md border border-gray-300 flex gap-2">
                                    <div className="flex-1">
                                        <span className="text-xl font-semibold flex flex-row gap-1">
                                            Địa chỉ nhận hàng
                                            <BsGeoAlt style={{width: 24, height: 24}}/>
                                        </span>
                                        {formCreateOrderUser.userAddress === null ?
                                            <p>Chọn địa chỉ</p> :
                                            <div>
                                                <p>{formCreateOrderUser.userAddress.customerName}</p>
                                                <p>{formCreateOrderUser.userAddress.phone}</p>
                                                <p>{formCreateOrderUser.userAddress.address}</p>
                                                <p>{formCreateOrderUser.userAddress.fullAddress}</p>
                                            </div>
                                        }
                                    </div>
                                    <div
                                        onClick={() => setChangingAddress(true)}
                                        className="flex items-center justify-center cursor-pointer hover:bg-green-100">
                                        <FaAngleRight style={{width: 24, height: 24}}/>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 px-4 py-2 gap-2">
                                <div className="p-2 rounded-md border border-gray-300 flex gap-2">
                                    <div className="flex-1">
                                        <span className="text-xl font-semibold flex flex-row gap-1">
                                            Mã khuyến mại
                                            <IoTicketOutline style={{width: 24, height: 24}}/>
                                        </span>
                                        <div className="flex flex-row gap-2 items-center justify-between">
                                            <input type="text" name="voucher-code" id="voucher-code" className="flex-1"
                                                   value={voucherCode}
                                                   onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                                   placeholder="VD: WELCOME"/>
                                            <button
                                                disabled={checkVoucher.isPending || voucherCode.trim() === ''}
                                                onClick={() => checkVoucher.mutate()}
                                                className="cursor-pointer bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 disable:opacity-50 disabled:cursor-not-allowed">
                                                Kiểm tra
                                            </button>
                                        </div>
                                        {voucherInfo && (!voucherInfo.isValid ?
                                                <p className="text-red-500 text-sm">{voucherInfo.message}</p>
                                                :
                                                <p className="text-green-500 text-sm">{voucherInfo.description}</p>
                                        )}
                                    </div>
                                    <div
                                        // onClick={() => setChangingAddress(true)}
                                        className="flex items-center justify-center cursor-pointer hover:bg-green-100">
                                        <FaAngleRight style={{width: 24, height: 24}}/>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 px-4 py-2 gap-2">
                                <div className="p-2 rounded-md border border-gray-300 flex flex-col gap-2">
                                    <div className="flex-1">
                                        <span className="text-xl font-semibold flex gap-1">
                                            Phương thức thanh toán
                                            <MdOutlinePayments style={{width: 24, height: 24}}/>
                                        </span>
                                    </div>
                                    <div className="flex flex-1 gap-3 justify-start">
                                        <div
                                            onClick={() => setFormCreateOrderUser({
                                                ...formCreateOrderUser,
                                                paymentMethod: PaymentMethod.Cash
                                            })}
                                            className="flex flex-col justify-between items-center gap-2 cursor-pointer"
                                        >
                                            <p className="text-center">Tiền mặt</p>
                                            <PiMoneyWavy style={{width: 48, height: 48}}/>
                                            <input type="radio" name="payment-method" id="cash"
                                                   checked={formCreateOrderUser.paymentMethod === PaymentMethod.Cash}
                                            />
                                        </div>
                                        {/*<div*/}
                                        {/*    onClick={() => setFormCreateOrderUser({*/}
                                        {/*        ...formCreateOrderUser,*/}
                                        {/*        paymentMethod: PaymentMethod.Momo*/}
                                        {/*    })}*/}
                                        {/*    className="flex flex-col justify-between items-center gap-2 cursor-pointer"*/}
                                        {/*>*/}
                                        {/*    <p className="text-center">Momo</p>*/}
                                        {/*    <Image src={images.logoMomo} alt="logo-momo" width={48} height={48}/>*/}
                                        {/*    <input type="radio" name="payment-method" id="momo"*/}
                                        {/*           checked={formCreateOrderUser.paymentMethod === PaymentMethod.Momo}*/}
                                        {/*    />*/}
                                        {/*</div>*/}
                                        <div
                                            onClick={() => setFormCreateOrderUser({
                                                ...formCreateOrderUser,
                                                paymentMethod: PaymentMethod.VnPay
                                            })}
                                            className="flex flex-col justify-between items-center gap-2 cursor-pointer"
                                        >
                                            <p className="text-center">VnPay</p>
                                            <Image src={images.logoVnPay} alt="logo-vnpay" width={48} height={48}/>
                                            <input type="radio" name="payment-method" id="vnpay"
                                                   checked={formCreateOrderUser.paymentMethod === PaymentMethod.VnPay}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 px-4 py-2 gap-2">
                                <div className="p-2 rounded-md border border-gray-300 flex flex-col gap-2">
                                    <div className="flex-1">
                                        <span className="text-xl font-semibold flex gap-1">
                                            Tổng tiền thanh toán
                                            <RiMoneyDollarCircleLine style={{width: 24, height: 24}}/>
                                        </span>
                                    </div>
                                    <p className="font-medium">Tiền tạm tính: {cartDetails?.totalPrice}VNĐ</p>
                                    <p className="font-medium">Giảm giá: {calculateDiscountedPrice()}VNĐ</p>
                                    <p className="font-medium">Tổng
                                        tiền: {convertCoin(Math.max((cartDetails?.totalPrice ?? 0) - calculateDiscountedPrice(), 0))}VNĐ</p>
                                </div>
                            </div>
                        </div>
                        <div
                            onClick={() => {
                                // console.log('formCreateOrderUser', formCreateOrderUser);
                                createOrderUser.mutate()
                            }}
                            className="text-lg text-center font-semibold h-fit px-4 py-2 bg-green-600 rounded-b-[6px] text-white cursor-pointer hover:bg-green-700">
                            Xác nhận mua hàng
                        </div>
                    </div>
                </div>
            </div>
            <Popup open={changingAddress} onClose={() => setChangingAddress(false)}>
                <SelectAddress queryKeys={[QueryKey.listAddress]} listAddress={listAddress}
                               onClose={() => setChangingAddress(false)}
                               form={formCreateOrderUser} setForm={setFormCreateOrderUser}/>
            </Popup>
        </>
    );
}

export default Page;

interface ISelectAddressProps extends IFormProps {
    listAddress: IUserAddressDto[],
    form: ICreateOrderRequest,
    setForm: (arg: ICreateOrderRequest) => void
}

function SelectAddress({listAddress, form, setForm, onClose}: ISelectAddressProps) {
    const [selectAddress, setSelectAddress] = React.useState<IUserAddressDto | null>(form.userAddress);


    return (
        <div className="flex flex-col gap-2 w-[600px] bg-white rounded-lg relative">
            <div
                className="text-xl text-white font-semibold w-full px-4 py-3 rounded-t-lg bg-green-600 flex items-center justify-center">
                Chọn địa chỉ giao hàng
            </div>
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto py-1 px-4">
                {listAddress.map((address) => (
                    <div key={address.id}
                         className={clsx("p-2 border rounded-md cursor-pointer hover:bg-green-100", {
                             "bg-green-100": address.id === selectAddress?.id,
                         })}
                         onClick={() => setSelectAddress(address)}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start gap-2">
                                <p className="font-semibold">{address.customerName}</p>
                                <p className="text-green-600 rounded-sm px-2 border border-green-600">{address.type === 1 ? 'Nhà riêng' : 'Văn phòng'}</p>
                            </div>
                            {address.isDefault &&
                                <div>
                                    <span
                                        className="text-gray-100 bg-green-700 px-2 py-1 border rounded-md">Mặc định</span>
                                </div>
                            }

                        </div>
                        <p>{address.phone}</p>
                        <p>{address.address}</p>
                        <p>{address.fullAddress}</p>
                    </div>
                ))}
            </div>
            <div
                onClick={() => {
                    setForm({
                        ...form,
                        userAddress: selectAddress!
                    });
                    onClose?.()
                }}
                className="text-xl text-white font-medium w-full px-4 py-3 rounded-b-lg bg-green-600 flex items-center justify-center cursor-pointer hover:bg-green-700">
                Xác nhận
            </div>
        </div>
    );
}