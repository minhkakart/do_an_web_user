'use client';
import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import userAddressService from "~/services/apis/userAddressService";
import Loading from "~/components/common/Loading";
import {IUserAddressDto} from "~/app/(authorized)/personal/interfaces";
import {RiMapPinAddLine} from "react-icons/ri";
import {GoPencil} from "react-icons/go";
import Popup from "~/components/common/Popup/Popup";
import FormCreateAddress from "~/app/(authorized)/personal/components/FormCreateAddress/FormCreateAddress";
import {QueryKey} from "~/constants/config/enum";
import Dialog from "~/components/common/Dialog";
import {Danger} from "iconsax-react";
import FormUpdateAddress from "~/app/(authorized)/personal/components/FormUpdateAddress/FormUpdateAddress";

function Addresses() {
    const queryClient = useQueryClient();

    const [creatingNewAddress, setCreatingNewAddress] = useState(false);
    const [updateId, setUpdateId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const {data: listAddress = [], isLoading} = useQuery<IUserAddressDto[]>({
        queryFn: () => apiRequest({
            api: async () => userAddressService.getAddresses()
        }),
        select(data) {
            return data;
        },
        enabled: true,
        queryKey: [QueryKey.listAddress]
    })

    const funcDeleteAddress = useMutation({
        mutationFn: (addressId: number) => apiRequest({
            api: async () => userAddressService.deleteAddress(addressId)
        }),
        onSuccess: async () => {
            setDeleteId(null);
            await queryClient.invalidateQueries({
                queryKey: [QueryKey.listAddress]
            })
        }
    })

    return (
        <>
            <div>
                <Loading loading={isLoading || funcDeleteAddress.isPending}/>
                <h1 className="text-2xl font-bold mb-4">Địa chỉ của tôi</h1>
                <div className="flex flex-col gap-2 w-full items-start justify-center">
                    {listAddress && listAddress.map((address) => (
                        <div
                            className="relative flex flex-col items-start justify-center p-4 border border-gray-300 rounded-lg w-full"
                            key={address.id}>
                            <div className="flex flex-row w-full justify-between items-center flex-wrap-reverse mb-4">
                                <div className="flex flex-wrap gap-2 items-center justify-start">
                                    <h2 className="text-xl font-semibold border-r pr-2 border-gray-300 min-w-[120px]">{address.customerName}</h2>
                                    <p className="border-r pr-2 border-gray-300 min-w-[120px]">{address.phone}</p>
                                    <p className="min-w-[120px]">{address.type === 1 ? 'Nhà riêng' : 'Văn phòng'}</p>
                                </div>
                                <div
                                    className="flex w-fit items-center justify-center gap-4">
                                    <div
                                        onClick={() => setUpdateId(address.id)}
                                        className="cursor-pointer text-blue-600 hover:text-blue-500 flex items-center justify-center gap-x-0.5">
                                        <GoPencil style={{width: 18, height: 18}}/>
                                        <span>Chỉnh sửa</span>
                                    </div>
                                    {!address.isDefault &&
                                        <div className="cursor-pointer text-red-600 hover:text-red-500"
                                             onClick={() => setDeleteId(address.id)}>
                                            Xóa
                                        </div>
                                    }
                                </div>
                            </div>
                            <p>{address.address}</p>
                            <p>{address.fullAddress}</p>
                            {address.isDefault && <span
                                className="text-gray-100 bg-green-700 mt-2 px-2 py-1 border rounded-md">Mặc định</span>}
                        </div>
                    ))}
                    {listAddress && listAddress.length === 0 && (
                        <p className="text-gray-500">Bạn chưa có địa chỉ nào.</p>
                    )}

                    <div
                        onClick={() => setCreatingNewAddress(true)}
                        className="flex items-center justify-center p-4 border border-gray-300 rounded-lg w-full gap-3 text-gray-100 bg-green-500 hover:bg-green-600 cursor-pointer">
                        <RiMapPinAddLine style={{width: 24, height: 24, color: "#f3f4f6"}}/>
                        <span className="text-gray-100">Thêm địa chỉ mới</span>
                    </div>
                </div>
            </div>

            <Popup open={creatingNewAddress} onClose={() => setCreatingNewAddress(false)}>
                <FormCreateAddress onClose={() => setCreatingNewAddress(false)} queryKeys={[QueryKey.listAddress]}/>
            </Popup>

            <Popup open={!!updateId} onClose={() => setUpdateId(null)}>
                <FormUpdateAddress onClose={() => setUpdateId(null)} queryKeys={[QueryKey.listAddress]} id={updateId!}/>
            </Popup>

            <Dialog
                type='error'
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                title='Xóa địa chỉ'
                note='Bạn có chắc chắn muốn xóa địa chỉ này?'
                icon={
                    <Danger size='76' color='#F46161' variant='Bold'/>
                }
                onSubmit={() => funcDeleteAddress.mutate(deleteId!)}
            />
        </>
    );
}

export default Addresses;