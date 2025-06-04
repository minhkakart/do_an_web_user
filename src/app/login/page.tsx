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

function Page() {
    const router = useRouter();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const login = useMutation({
        mutationFn: () =>
            apiRequest({
                showMessageFailed: true,
                showMessageSuccess: true,
                msgSuccess: 'Đăng nhập thành công!',
                setLoadingState: setLoading,
                api: () => authService.login({
                    userName: username,
                    password: password,
                    type: 0,
                }),
            }),
        async onSuccess(data: IToken) {
            if (data) {
                localStorage.setItem(KEY_STORAGE_TOKEN, JSON.stringify(data));
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
        <div className="flex items-center justify-center h-screen w-screen">
            <Loading loading={loading}/>
            <div
                className="min-w-[600px] w-1/3 bg-white p-6 rounded shadow-md flex flex-col justify-center items-center h-[400px]">
                <h1>Login</h1>
                <input
                    className="border border-gray-300 p-2 rounded w-full mt-4"
                    placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input
                    className="border border-gray-300 p-2 rounded w-full mt-4"
                    placeholder="Password" type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
                    onClick={() => {
                        setLoading(true);
                        login.mutate();
                    }}>Đăng nhập
                </button>
                <div className="flex justify-between align-bottom w-full mt-4">
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
    );
}

export default Page;