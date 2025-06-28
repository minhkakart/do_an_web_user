'use client';
import React from 'react';
import {useSearchParams} from "next/navigation";
import {TickCircle} from "iconsax-react";
import Link from "next/link";
import {Paths, PersonalTabIds} from "~/constants/config";

function Page() {
    const searchParamsUrl = new URLSearchParams(useSearchParams());

    return (
        <>
            (
            <div className="flex justify-center items-center flex-1">
                <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg w-[400px]">
                    <div className="flex justify-center items-center">
                        <TickCircle size="60" color="#FF8A65"/>
                    </div>
                    <p className="text-center">{searchParamsUrl.get("message") || "---"}</p>
                    <div className="flex flex-1 gap-2">
                        <Link href={Paths.Home}
                              className="py-1.5 bg-green-600 text-white! flex items-center justify-center flex-1 rounded-md">
                            Về trang chủ
                        </Link>
                        <Link href={Paths.Personal + "?tab=" + PersonalTabIds.orders}
                              className="py-1.5 bg-orange-600 text-white! flex items-center justify-center flex-1 rounded-md">
                            Xem đơn hàng
                        </Link>
                    </div>
                </div>
            </div>
            )
        </>
    );
}

export default Page;