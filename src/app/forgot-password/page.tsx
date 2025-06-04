'use client'
import Loading from "~/components/common/Loading";
import Link from "next/link";

function Page() {

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Loading loading={false}/>
            <div
                className="min-w-[600px] w-1/3 bg-white p-6 rounded shadow-md flex flex-col justify-center items-center h-[400px]">
                <h1>Quên mật khẩu</h1>
                <p className="text-gray-500">Vui lòng liên hệ quản trị viên để lấy lại mật khẩu.</p>
                <Link href="/login"
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full text-center">Trở về trang đăng nhập</Link>
            </div>
        </div>
    );
}

export default Page;