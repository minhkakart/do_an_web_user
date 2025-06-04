'use client'
import Loading from "~/components/common/Loading";
import Link from "next/link";

function Page() {

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Loading loading={false}/>
            <div
                className="min-w-[600px] w-1/3 bg-white p-6 rounded shadow-md flex flex-col justify-center items-center h-[400px]">
                <h1>Register</h1>
                <p>Registration functionality is not implemented yet.</p>
                <Link href="/login" className="text-blue-500 mt-4">Go to Login</Link>
            </div>
        </div>
    );
}

export default Page;