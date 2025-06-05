import React from 'react';
import {useMutation, useQuery} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import userService from "~/services/apis/userService";
import Loading from "~/components/common/Loading";
import Button from "~/components/common/Button";
import Popup from "~/components/common/Popup";
import Form, {FormContext, Input} from "~/components/common/Form";
import {FolderOpen} from "iconsax-react";

function Account() {
    const [changingPassword, setChangingPassword] = React.useState(false);

    const {data: accountName, isLoading} = useQuery<string>({
        queryFn: () => apiRequest({
            api: async () => userService.getAccount()
        }),
        select(data) {
            return data;
        },
        queryKey: []
    })

    return (
        <>
            <Loading loading={isLoading}/>
            <div
                className="bg-white min-w-fit gap-5 flex flex-col">
                <h1 className="text-2xl font-bold mb-4">Tài khoản</h1>
                <div className="flex flex-row flex-wrap justify-start items-center h-full">
                    <p className="text-xl mr-1">Tên đăng nhập:</p>
                    <p className="min-w-[200px] border border-gray-300 p-2 text-lg rounded-md mr-3">{accountName}</p>
                    <Button
                        w_fit
                        p_10_24
                        green
                        rounded_8
                        wrapperClasses="block w-fit"
                        className="text-white block"
                        onClick={() => setChangingPassword(true)}
                    >
                        Đổi mật khẩu
                    </Button>
                </div>
            </div>

            <Popup open={changingPassword} onClose={() => setChangingPassword(false)}>
                <FormChangePassword onClose={() => setChangingPassword(false)}/>
            </Popup>

        </>
    );
}

export default Account;

function FormChangePassword({onClose} = {
    onClose: () => {
    }
}) {
    const [form, setForm] = React.useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const changePasswordMutation = useMutation({
        mutationFn: () => apiRequest({
            api: async () => userService.changePassword(form),
            msgSuccess: 'Đổi mật khẩu thành công',
            showMessageSuccess: true,
            showMessageFailed: true,
        }),
        onSuccess: () => {
            onClose();
        },
    })

    const handleSubmit = () => {
        changePasswordMutation.mutate();
    }

    return (
        <>
            <Loading loading={changePasswordMutation.isPending}/>
            <div
                className="bg-white min-h-[420px] max-w-[600px] rounded-xl shadow-lg pt-[60px] pb-12 px-10 gap-5 flex flex-col">
                <Form form={form} setForm={setForm} onSubmit={handleSubmit}>
                    <div className="relative w-[540px] bg-white flex flex-col p-6 gap-4">
                        <h4 className="text-[#2f3d50] text-xl font-semibold py-6 text-center">Đổi mật khẩu</h4>
                        <Input
                            placeholder=""
                            name='oldPassword'
                            type='password'
                            isRequired
                            label={
                                <span>
								Mật khẩu cũ <span style={{color: 'red'}}>*</span>
                            </span>
                            }
                        />
                        <Input
                            placeholder=""
                            name='newPassword'
                            type='password'
                            isRequired
                            label={
                                <span>
								Mật khẩu mới <span style={{color: 'red'}}>*</span>
                            </span>
                            }
                        />
                        <Input
                            placeholder=""
                            name='confirmNewPassword'
                            type='password'
                            isRequired
                            valueConfirm={form.newPassword}
                            label={
                                <span>
								Nhập lại mật khẩu mới <span style={{color: 'red'}}>*</span>
                            </span>
                            }
                        />

                        <div className="flex items-center justify-end gap-[10px]">
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