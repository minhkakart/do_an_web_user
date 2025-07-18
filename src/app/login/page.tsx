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
import {KEY_STORAGE_TOKEN} from "~/constants/config";
import images from "~/constants/images/images";
import {UserRole} from "~/constants/config/enum";
import Form, {FormContext, Input} from "~/components/common/Form";
import SwitchButton from "~/components/common/SwitchButton";
import {deleteItemStorage, setItemStorage} from "~/commons/funcs/localStorage";
import Button from "~/components/common/Button";
import Image from "next/image";

function Page() {
    const router = useRouter();

    const [saveToken, setSaveToken] = useState<boolean>(false);
    const [form, setForm] = useState<{
        userName: string;
        password: string;
        type: UserRole,
    }>({
        userName: '',
        password: '',
        type: UserRole.Customer,
    });
    const [loading, setLoading] = useState<boolean>(false);

    const login = useMutation({
        mutationFn: () =>
            apiRequest({
                showMessageFailed: true,
                showMessageSuccess: true,
                msgSuccess: 'Đăng nhập thành công!',
                setLoadingState: setLoading,
                api: () => authService.login(form),
            }),
        async onSuccess(data: IToken) {
            if (data) {
                setItemStorage(KEY_STORAGE_TOKEN, data);
                // if (saveToken) {
                // } else {
                //     deleteItemStorage(KEY_STORAGE_TOKEN);
                // }
                store.dispatch(setToken(data))
                const res: IUserData  = await apiRequest({
                    api: async () => authService.checkToken(),
                    showMessageFailed: true
                });
                if (!!res){
                    store.dispatch(setUserData(res))
                    store.dispatch(setIsLoggedIn(true))
                    store.dispatch(setIsTokenValid(true))
                }
                router.replace('/')
            }
        },
    });

    return (
        // <div className="flex items-center justify-center h-screen w-screen">
        //     <Loading loading={loading}/>
        //     <div
        //         className="min-w-[600px] w-1/3 bg-white p-6 rounded shadow-md flex flex-col justify-center items-center h-[400px]">
        //         <h1>Login</h1>
        //         <input
        //             className="border border-gray-300 p-2 rounded w-full mt-4"
        //             placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        //         <input
        //             className="border border-gray-300 p-2 rounded w-full mt-4"
        //             placeholder="Password" type="password" value={password}
        //             onChange={(e) => setPassword(e.target.value)}/>
        //         <button
        //             className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
        //             onClick={() => {
        //                 setLoading(true);
        //                 login.mutate();
        //             }}>Đăng nhập
        //         </button>
        //         <div className="flex justify-between align-bottom w-full mt-4">
        //             <Link href="/forgot-password" className="text-blue-500! hover:underline!">
        //                 Quên mật khẩu?
        //             </Link>
        //             <div>
        //                 Chưa có tài khoản?
        //                 <Link href="/register" className="bottom-4 right-4 text-blue-500! hover:underline! ml-1">
        //                     Đăng ký
        //                 </Link>
        //             </div>
        //         </div>
        //     </div>
        // </div>

    <div className="flex items-center justify-center h-full w-full bg-white">
        <Image src={images.background} alt="logo" width={800} height={800} className="h-full "/>
        <div className="flex-1 flex items-center justify-center h-full">
            <Form form={form} setForm={setForm} onSubmit={() => {
                setLoading(true);
                login.mutate();
            }}>
                <Loading loading={login.isPending}/>
                <div
                    className="w-[700px] rounded-[32px] bg-white px-[95px] py-[68px] flex items-center justify-center flex-col">
                    <h4 className="text-[#2f3d50] text-[20px] font-bold mt-4">ĐĂNG NHẬP TÀI KHOẢN</h4>
                    <div className="w-full mt-8">
                        <Input type='text' placeholder='Tên tài khoản' name='userName' value={form?.userName}
                               onClean
                               isRequired/>
                        <Input type='password' placeholder='Mật khẩu' name='password' value={form?.password} onClean
                               isRequired/>

                        <div className="flex items-center justify-between mt-5">
                            <div className="flex items-center gap-3 select-none">
                                <SwitchButton
                                    name='saveToken'
                                    value={saveToken}
                                    onChange={(e: any) => setSaveToken(e.target.value)}
                                />
                                <p className="text-[#2f3d50] text-[15px] font-normal">Ghi nhớ đăng nhập</p>
                            </div>
                        </div>

                        <div className="mt-7">
                            <FormContext.Consumer>
                                {({isDone}) => (
                                    <Button primaryLinear bold rounded_8 disable={!isDone} wrapperClasses="w-full"
                                            className="bg-blue-400! text-white! w-full">
                                        Đăng nhập
                                    </Button>
                                )}
                            </FormContext.Consumer>
                        </div><div className="flex justify-between align-bottom w-full mt-4">
                        <Link href="/forgot-password" className="text-blue-500! hover:underline!">
                            Quên mật khẩu?
                        </Link>
                        <div>
                            Chưa có tài khoản?
                            <Link href="/register" className="bottom-4 right-4 text-blue-500! hover:underline! ml-1">
                                Đăng ký
                            </Link>
                        </div>
                    </div>
                    </div>
                </div>
            </Form>
        </div>
    </div>
    );
}

export default Page;