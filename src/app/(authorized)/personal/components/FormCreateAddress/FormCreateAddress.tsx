'use client';
import React from 'react';
import Form from "~/components/common/Form/Form";
import {FormContext, Input} from "~/components/common/Form";
import Button from "~/components/common/Button";
import {FolderOpen} from "iconsax-react";
import {IUserAddressCreateRequest} from "~/app/(authorized)/personal/components/FormCreateAddress/interfaces";
import {BooleanType, QueryKey, TypeAddress} from "~/constants/config/enum";
import SelectForm from "~/components/common/SelectForm";
import GridColumn from "~/layouts/GridColumn";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {IDistrictDto, IProvinceDto, IWardDto} from "~/commons/interfaces";
import {apiRequest} from "~/services";
import addressService from "~/services/apis/addressService";
import clsx from "clsx";
import {toast} from "react-toastify";
import {ToastCustom} from "~/commons/funcs/toast";
import userAddressService from "~/services/apis/userAddressService";
import Loading from "~/components/common/Loading";

function FormCreateAddress({onClose, queryKeys = []}: {
    onClose: () => void,
    queryKeys?: any[]
}) {
    const queryClient = useQueryClient();

    const [formCreateAddress, setFormCreateAddress] = React.useState<IUserAddressCreateRequest>({
        customerName: '',
        phone: '',
        provinceId: 0,
        districtId: 0,
        wardId: 0,
        customAddress: '',
        geoPosition: '',
        type: TypeAddress.Home,
        isDefault: BooleanType.False
    })

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
            api: async () => addressService.getDistricts(formCreateAddress.provinceId ?? 0)
        }),
        select(data) {
            return data;
        },
        enabled: formCreateAddress.provinceId! > 0,
        queryKey: [QueryKey.listDistrict, formCreateAddress.provinceId]
    })
    const {data: listWard = []} = useQuery<IWardDto[]>({
        queryFn: () => apiRequest({
            api: async () => addressService.getWards(formCreateAddress.districtId ?? 0)
        }),
        select(data) {
            return data;
        },
        enabled: formCreateAddress.districtId! > 0,
        queryKey: [QueryKey.listWard, formCreateAddress.districtId]
    })

    const createAddressMutation = useMutation<null>({
        mutationFn: () => apiRequest({
            api: async () => userAddressService.createAddress(formCreateAddress),
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
        if (formCreateAddress.provinceId === 0) {
            return toast.warn("Vui lòng chọn đầy đủ Tỉnh/Thành phố", ToastCustom.toastWarn);
        }
        if (formCreateAddress.districtId === 0) {
            return toast.warn("Vui lòng chọn đầy đủ Quận/Huyện", ToastCustom.toastWarn);
        }
        if (formCreateAddress.wardId === 0) {
            return toast.warn("Vui lòng chọn đầy đủ Xã/Thị trấn", ToastCustom.toastWarn);
        }

        createAddressMutation.mutate();
    }

    return (
        <>
            <Loading loading={createAddressMutation.isPending}/>
            <div
                className="bg-white min-h-[420px] w-[800px] rounded-xl shadow-lg pt-[60px] pb-12 px-10 gap-5 flex flex-col">
                <Form form={formCreateAddress} setForm={setFormCreateAddress} onSubmit={handleSubmit}>
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
                                        setFormCreateAddress((prev) => ({
                                            ...prev,
                                            provinceId: 0,
                                            districtId: 0,
                                            wardId: 0,
                                        }))
                                    }
                                    value={formCreateAddress.provinceId}
                                    options={listProvince || []}
                                    getOptionLabel={(opt) => opt.name}
                                    getOptionValue={(opt) => opt.id}
                                    onSelect={(data) => {
                                        setFormCreateAddress((prev) => ({
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
                                            setFormCreateAddress((prev) => ({
                                                ...prev,
                                                districtId: 0,
                                                wardId: 0,
                                            }))
                                        }
                                        value={formCreateAddress.districtId}
                                        options={listDistrict || []}
                                        getOptionLabel={(opt) => opt.name}
                                        getOptionValue={(opt) => opt.id}
                                        onSelect={(data) => {
                                            setFormCreateAddress((prev) => ({
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
                                        setFormCreateAddress((prev) => ({
                                            ...prev,
                                            wardId: 0,
                                        }))
                                    }
                                    value={formCreateAddress.wardId}
                                    options={listWard || []}
                                    getOptionLabel={(opt) => opt.name}
                                    getOptionValue={(opt) => opt.id}
                                    onSelect={(data) => {
                                        setFormCreateAddress((prev) => ({
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
                                       checked={formCreateAddress.isDefault === BooleanType.True}
                                       onChange={(e) => {
                                           setFormCreateAddress({
                                               ...formCreateAddress,
                                               isDefault: formCreateAddress.isDefault === BooleanType.True
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
                                        {'border-red-400 bg-red-400 text-white': formCreateAddress.type === TypeAddress.Home})
                                    }
                                    onClick={() => setFormCreateAddress({
                                        ...formCreateAddress,
                                        type: TypeAddress.Home
                                    })}
                                >
                                    Nhà riêng
                                </div>
                                <div
                                    className={clsx("cursor-pointer border border-gray-300 rounded-md p-2",
                                        {'border-red-400 bg-red-400 text-white': formCreateAddress.type === TypeAddress.Work})
                                    }
                                    onClick={() => setFormCreateAddress({
                                        ...formCreateAddress,
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

export default FormCreateAddress;