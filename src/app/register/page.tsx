'use client'
import {useState} from 'react';
import {useMutation} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import authService from "~/services/apis/authService";
import Loading from "~/components/common/Loading";
import {IToken, IUserData} from "~/commons/interfaces";
import {store} from "~/redux/store";
import {setIsLoggedIn, setIsTokenValid, setToken, setUserData} from "~/redux/appReducer";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {KEY_STORAGE_TOKEN, Paths} from "~/constants/config";
import images from "~/constants/images/images";
import {UserRole} from "~/constants/config/enum";
import Form, {FormContext, Input} from "~/components/common/Form";
import SwitchButton from "~/components/common/SwitchButton";
import {deleteItemStorage, setItemStorage} from "~/commons/funcs/localStorage";
import Button from "~/components/common/Button";
import Image from "next/image";

function Page() {
    const router = useRouter();

    const [form, setForm] = useState<{
        fullname: string,
        username: string,
        email: string,
        phone: string,
        password: string
    }>({
        fullname: '',
        username: '',
        email: '',
        phone: '',
        password: ''
    });

    const registerFunc = useMutation({
        mutationFn: () =>
            apiRequest({
                showMessageFailed: true,
                showMessageSuccess: true,
                msgSuccess: 'Đăng ký thành công!',
                api: () => authService.register(form),
            }),
        async onSuccess() {
            router.replace(Paths.Login)
        },
    });

    return (
        <div className="flex items-center justify-center h-full w-full bg-white">
            <div className="flex-1 flex items-center justify-center h-full">
                <Form form={form} setForm={setForm} onSubmit={() => {
                    registerFunc.mutate();
                }}>
                    <Loading loading={registerFunc.isPending}/>
                    <div
                        className="w-[700px] rounded-[32px] bg-white px-[95px] py-[68px] flex items-center justify-center flex-col">
                        <h4 className="text-[#2f3d50] text-[20px] font-bold mt-4">ĐĂNG NHẬP TÀI KHOẢN</h4>
                        <div className="w-full mt-8">
                            <Input type='text' placeholder='Tên hiển thị' name='fullname' value={form?.fullname}
                                   onClean
                                   isRequired/>
                            <Input type='text' placeholder='Tên đăng nhập' name='username' value={form?.username}
                                   onClean
                                   isRequired/>
                            <Input type='email' placeholder='Email' name='email' isEmail value={form?.email}
                                   onClean
                                   isRequired/>
                            <Input type='text' placeholder='Số điện thoại' name='phone' value={form?.phone}
                                   onClean
                                   isRequired/>
                            <Input type='password' placeholder='Mật khẩu' name='password' value={form?.password} onClean
                                   isRequired/>

                            <div className="mt-7">
                                <FormContext.Consumer>
                                    {({isDone}) => (
                                        <Button primaryLinear bold rounded_8 disable={!isDone} wrapperClasses="w-full"
                                                className="bg-blue-400! text-white! w-full">
                                            Đăng ký
                                        </Button>
                                    )}
                                </FormContext.Consumer>
                            </div>
                            <div className="flex justify-between align-bottom w-full mt-4">
                                <div>
                                    Đã có tài khoản?
                                    <Link href={Paths.Login}
                                          className="bottom-4 right-4 text-blue-500! hover:underline! ml-1">
                                        Đăng nhập
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
            <Image src={images.background} alt="logo" width={800} height={800} className="h-full "/>
        </div>
    );
}

export default Page;