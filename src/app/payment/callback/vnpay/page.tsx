'use client';
import React, {useEffect} from 'react';
import {useSearchParams} from "next/navigation";
import Loading from "~/components/common/Loading";
import {useMutation} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import orderService from "~/services/apis/orderService";
import {IOrderPaymentResponseDto} from "~/app/payment/callback/vnpay/intefaces";
import {TickCircle} from "iconsax-react";
import Link from "next/link";
import {Paths, PersonalTabIds} from "~/constants/config";

function Page() {
    const searchParams = useSearchParams();
    const [callbackData, setCallbackData] = React.useState<IOrderPaymentResponseDto | null>(null);

    const vnPayCallbackData = useMutation({
        mutationFn: () => apiRequest({
            api: () => orderService.vnPayCallback(searchParams.toString())
        }),
        onSuccess(data: IOrderPaymentResponseDto) {
            setCallbackData(data);
        },
    })

    useEffect(() => {
        if (!!searchParams.toString()) {
            vnPayCallbackData.mutate();
        }
    }, [searchParams])

    return (
        <>
            <Loading loading={vnPayCallbackData.isPending}/>
            {callbackData && (
                <div className="flex justify-center items-center flex-1">
                    <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg w-[400px]">
                        <div className="flex justify-center items-center">
                            <TickCircle size="60" color="#FF8A65"/>
                        </div>
                        <p className="text-center">{callbackData.message}</p>
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
            )}
        </>
    );
}

export default Page;