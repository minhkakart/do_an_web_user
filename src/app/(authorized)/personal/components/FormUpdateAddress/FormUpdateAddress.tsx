import React, {useEffect, useState} from 'react';
import {IUserAddressDetailDto, IUserAddressUpdateRequest} from "./intefaces";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import userAddressService from "~/services/apis/userAddressService";
import {BooleanType, QueryKey, TypeAddress} from "~/constants/config/enum";
import {IDistrictDto, IProvinceDto, IWardDto} from "~/commons/interfaces";
import addressService from "~/services/apis/addressService";
import Loading from "~/components/common/Loading";
import Form from "~/components/common/Form/Form";
import {FormContext, Input} from "~/components/common/Form";
import GridColumn from "~/layouts/GridColumn";
import SelectForm from "~/components/common/SelectForm";
import clsx from "clsx";
import Button from "~/components/common/Button";
import {FolderOpen} from "iconsax-react";
import {toast} from "react-toastify";
import {ToastCustom} from "~/commons/funcs/toast";

function FormUpdateAddress({onClose, queryKeys = [], id}: {
    onClose: () => void,
    queryKeys?: any[],
    id: number
}) {
    const queryClient = useQueryClient();

    const [formUpdate, setFormUpdate] = useState<IUserAddressUpdateRequest>({
        id: id,
        customerName: '',
        phone: '',
        provinceId: 0,
        districtId: 0,
        wardId: 0,
        customAddress: '',
        geoPosition: null,
        type: 1,
        isDefault: 0
    })

    const {data: addressDetail, isFetched} = useQuery<IUserAddressDetailDto>({
        queryFn: () => apiRequest({
            api: async () => userAddressService.getDetailAddresses(formUpdate.id)
        }),
        select(data) {
            return data;
        },
        queryKey: [QueryKey.getDetailAddress, formUpdate.id]
    });

    useEffect(() => {
        if (!!addressDetail){
            setFormUpdate({
                id: addressDetail.id,
                customerName: addressDetail.customerName,
                phone: addressDetail.phone,
                provinceId: addressDetail.fullAddress.province.id,
                districtId: addressDetail.fullAddress.district.id,
                wardId: addressDetail.fullAddress.ward.id,
                customAddress: addressDetail.address,
                geoPosition: addressDetail.geoPosition,
                type: addressDetail.type,
                isDefault: addressDetail.isDefault ? BooleanType.True : BooleanType.False
            });
        }
    }, [isFetched]);

    const {data: listProvince = []} = useQuery<IProvinceDto[]>({
        queryFn: () => apiRequest({
            api: async () => addressService.getProvinces()
        }),
        select(data) {
            return data;
        },
        queryKey: [QueryKey.listProvince]
    })
    const {data: listDistrict = []} = useQuery<IDistrictDto[]>({
        queryFn: () => apiRequest({
            api: async () => addressService.getDistricts(formUpdate.provinceId ?? 0)
        }),
        select(data) {
            return data;
        },
        enabled: formUpdate.provinceId! > 0,
        queryKey: [QueryKey.listDistrict, formUpdate.provinceId]
    })
    const {data: listWard = []} = useQuery<IWardDto[]>({
        queryFn: () => apiRequest({
            api: async () => addressService.getWards(formUpdate.districtId ?? 0)
        }),
        select(data) {
            return data;
        },
        enabled: formUpdate.districtId! > 0,
        queryKey: [QueryKey.listWard, formUpdate.districtId]
    })

    const updateAddressMutation = useMutation<null>({
        mutationFn: () => apiRequest({
            api: async () => userAddressService.updateAddress(formUpdate),
            showMessageFailed: true,
            showMessageSuccess: true,
            msgSuccess: 'Thêm địa chỉ thành công',
        }),
        async onSuccess() {
            await queryClient.invalidateQueries({
                queryKey: queryKeys
            });
            onClose();
        }
    })

    const handleSubmit = () => {
        if (formUpdate.provinceId === 0) {
            return toast.warn("Vui lòng chọn đầy đủ Tỉnh/Thành phố", ToastCustom.toastWarn);
        }
        if (formUpdate.districtId === 0) {
            return toast.warn("Vui lòng chọn đầy đủ Quận/Huyện", ToastCustom.toastWarn);
        }
        if (formUpdate.wardId === 0) {
            return toast.warn("Vui lòng chọn đầy đủ Xã/Thị trấn", ToastCustom.toastWarn);
        }

        updateAddressMutation.mutate();
    }


    return (
        <>
            <Loading loading={updateAddressMutation.isPending}/>
            <div
                className="bg-white min-h-[420px] w-[800px] rounded-xl shadow-lg pt-[60px] pb-12 px-10 gap-5 flex flex-col">
                <Form form={formUpdate} setForm={setFormUpdate} onSubmit={handleSubmit}>
                    <div className="relative w-full h-full bg-white flex flex-col p-6 gap-4">
                        <h4 className="text-[#2f3d50] text-xl font-semibold py-6 text-center">Thêm mới địa chỉ</h4>
                        <div className="flex items-center justify-between gap-4">
                            <div className="w-full">
                                <Input
                                    placeholder="Nhập họ và tên"
                                    name='customerName'
                                    type='text'
                                    isRequired
                                    label={
                                        <span>
								Họ và tên <span style={{color: 'red'}}>*</span>
                            </span>
                                    }
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    placeholder="Nhập số điện thoại"
                                    name='phone'
                                    type='text'
                                    isPhone
                                    isRequired
                                    label={
                                        <span>
								Số điện thoại<span style={{color: 'red'}}>*</span>
                            </span>
                                    }
                                />
                            </div>
                        </div>

                        <div className="">
                            <GridColumn col_3>
                                <SelectForm<IProvinceDto>
                                    placeholder='Chọn Tỉnh/Thành phố'
                                    label={<span>Tỉnh/Thành phố<span style={{color: 'red'}}>*</span></span>}
                                    onClean={() =>
                                        setFormUpdate((prev) => ({
                                            ...prev,
                                            provinceId: 0,
                                            districtId: 0,
                                            wardId: 0,
                                        }))
                                    }
                                    value={formUpdate.provinceId}
                                    options={listProvince || []}
                                    getOptionLabel={(opt) => opt.name}
                                    getOptionValue={(opt) => opt.id}
                                    onSelect={(data) => {
                                        setFormUpdate((prev) => ({
                                            ...prev,
                                            provinceId: data.id,
                                            districtId: 0,
                                            wardId: 0,
                                        }));
                                    }}
                                />
                                <div>
                                    <SelectForm<IDistrictDto>
                                        placeholder='Chọn Quận/Huyện'
                                        label={<span>Quận/Huyện<span style={{color: 'red'}}>*</span></span>}
                                        onClean={() =>
                                            setFormUpdate((prev) => ({
                                                ...prev,
                                                districtId: 0,
                                                wardId: 0,
                                            }))
                                        }
                                        value={formUpdate.districtId}
                                        options={listDistrict || []}
                                        getOptionLabel={(opt) => opt.name}
                                        getOptionValue={(opt) => opt.id}
                                        onSelect={(data) => {
                                            setFormUpdate((prev) => ({
                                                ...prev,
                                                districtId: data.id,
                                                wardId: 0,
                                            }));
                                        }}
                                    />
                                </div>
                                <SelectForm<IWardDto>
                                    placeholder='Chọn Xã/Thị trấn'
                                    label={<span>Xã/Thị trấn<span style={{color: 'red'}}>*</span></span>}
                                    onClean={() =>
                                        setFormUpdate((prev) => ({
                                            ...prev,
                                            wardId: 0,
                                        }))
                                    }
                                    value={formUpdate.wardId}
                                    options={listWard || []}
                                    getOptionLabel={(opt) => opt.name}
                                    getOptionValue={(opt) => opt.id}
                                    onSelect={(data) => {
                                        setFormUpdate((prev) => ({
                                            ...prev,
                                            wardId: data?.id,
                                        }));
                                    }}
                                />
                            </GridColumn>
                        </div>

                        <Input
                            placeholder=""
                            name='customAddress'
                            type='text'
                            label={
                                <span>
								Địa chỉ cụ thể
                            </span>
                            }
                        />

                        <div className="flex min-w-full items-center justify-between gap-4">
                            <div className="flex w-fit items-center justify-start gap-2">
                                <input id="form-is-default"
                                       className="w-5 h-5"
                                       type="checkbox"
                                       disabled={formUpdate.isDefault === BooleanType.True}
                                       checked={formUpdate.isDefault === BooleanType.True}
                                       onChange={() => {
                                           setFormUpdate({
                                               ...formUpdate,
                                               isDefault: formUpdate.isDefault === BooleanType.True
                                                   ? BooleanType.False
                                                   : BooleanType.True
                                           })
                                       }}
                                />
                                <label htmlFor="form-is-default">
                                <span className="text-gray-700 font-[500]">
                                    Đặt làm địa chỉ mặc định
                                </span>
                                </label>
                            </div>
                            <div className="flex w-fit items-center justify-center gap-2">
                                <div
                                    className={clsx("cursor-pointer border border-gray-300 rounded-md p-2",
                                        {'border-red-400 bg-red-400 text-white': formUpdate.type === TypeAddress.Home})
                                    }
                                    onClick={() => setFormUpdate({
                                        ...formUpdate,
                                        type: TypeAddress.Home
                                    })}
                                >
                                    Nhà riêng
                                </div>
                                <div
                                    className={clsx("cursor-pointer border border-gray-300 rounded-md p-2",
                                        {'border-red-400 bg-red-400 text-white': formUpdate.type === TypeAddress.Work})
                                    }
                                    onClick={() => setFormUpdate({
                                        ...formUpdate,
                                        type: TypeAddress.Work
                                    })}
                                >
                                    Văn phòng
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-[10px] mt-6">
                            <div>
                                <Button p_12_20 grey rounded_6 onClick={onClose}>
                                    Hủy bỏ
                                </Button>
                            </div>
                            <FormContext.Consumer>
                                {({isDone}) => (
                                    <div className="">
                                        <Button disable={!isDone} p_12_20 blue rounded_6
                                                icon={<FolderOpen size={18} color='#fff'/>}>
                                            Lưu lại
                                        </Button>
                                    </div>
                                )}
                            </FormContext.Consumer>
                        </div>
                    </div>
                </Form>
            </div>
        </>
    );
}

export default FormUpdateAddress;