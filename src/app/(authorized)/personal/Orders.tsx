'use client';
import React from 'react';
import clsx from "clsx";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import orderService from "~/services/apis/orderService";
import {IUserOrderDto} from "~/app/(authorized)/personal/interfaces";
import {IPageResponse} from "~/commons/interfaces";
import {OrderStatus, QueryKey} from "~/constants/config/enum";
import moment from "moment";
import Image from "next/image";
import {resourceUrl} from "~/commons/funcs/optionConvert";
import Dialog from "~/components/common/Dialog";
import {Danger} from "iconsax-react";
import Popup from "~/components/common/Popup/Popup";


function Orders() {
    const [tab, setTab] = React.useState<'processing' | 'completed'>('processing');

    return (
        <div className="flex flex-1 flex-col w-full">
            <div className="flex border-b border-gray-300 py-2">
                <div
                    onClick={() => setTab('processing')}
                    className={clsx("flex items-center justify-center flex-1/2 border-r border-gray-300 hover:bg-gray-100 cursor-pointer", {
                        "text-green-600 font-semibold": tab === 'processing',
                    })}>
                    Đơn đang xử lý
                </div>
                <div
                    onClick={() => setTab('completed')}
                    className={clsx("flex items-center justify-center flex-1/2 py-2 hover:bg-gray-100 cursor-pointer", {
                        "text-green-600 font-semibold": tab === 'completed',
                    })}>
                    Đơn đã hoàn thành
                </div>
            </div>
            <div className="flex flex-1 flex-col w-full">
                {
                    (() => {
                        switch (tab) {
                            case 'processing':
                                return <UserOrders type={1}/>;
                            case 'completed':
                                return <UserOrders type={2}/>;
                            default:
                                return <></>;
                        }
                    })()
                }

            </div>
        </div>
    );
}

export default Orders;

function UserOrders({type}: { type: number }) {
    const queryClient = useQueryClient();
    const [cancelOrderId, setCancelOrderId] = React.useState<number | null>(null);
    const [orderDetailId, setOrderDetailId] = React.useState<number | null>(null);

    const {data: userOrders} = useQuery({
        queryFn: () => apiRequest({
            api: () => orderService.getListUserOrders({
                page: 1,
                size: 5,
                isPaging: false,
                type: type
            })
        }),
        select(data: IPageResponse<IUserOrderDto>) {
            return data;
        },
        queryKey: [QueryKey.listUserOrder, type]
    })

    const cancelOrder = useMutation({
        mutationFn: () => apiRequest({
            api: () => orderService.cancelOrder(cancelOrderId!),
            showMessageFailed: true,
            showMessageSuccess: true,
            msgSuccess: "Đã hủy đơn hàng"
        }),
        async onSuccess() {
            setCancelOrderId(null)
            await queryClient.invalidateQueries({queryKey: [QueryKey.listUserOrder]})
        }
    })

    return (
        <>
            <div className="flex flex-1 flex-col w-full gap-2 py-2">
                {userOrders?.items?.map((order) => (
                    <div
                        onClick={() => setOrderDetailId(order.id)}
                        className="flex flex-1 flex-col w-full border border-gray-300 rounded-lg p-2 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <p>#{order.code}</p>
                            <p>{moment(order.orderTime).format("DD/MM/YYYY HH:mm")}</p>
                        </div>
                        <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-2">
                            <div className="flex flex-col items-start justify-center">
                                <Image src={resourceUrl(order.products[0].productSize.product.imageUrl)} alt="image"
                                       width={100} height={100}/>
                                <p>
                                    {order.products[0].productSize.product.name} - {order.products[0].productSize.size.name}{order.products.length > 1 ? "..." : ""}
                                </p>
                            </div>
                            <div className="flex flex-col items-end justify-center">
                                <p>{order.products.reduce((v, c) => v + c.quantity, 0)} món</p>
                                <p>Giá: {order.finalAmount.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p>Trạng thái: {
                                (() => {
                                    switch (order.status) {
                                        case OrderStatus.Pending:
                                            return <span className="text-yellow-500">Đang chờ</span>;
                                        case OrderStatus.Approved:
                                            return <span className="text-blue-500">Đã xác nhận</span>;
                                        case OrderStatus.Making:
                                            return <span className="text-orange-500">Đang làm</span>;
                                        case OrderStatus.Delivering:
                                            return <span className="text-purple-500">Đang giao</span>;
                                        case OrderStatus.Finished:
                                            return <span className="text-green-500">Đã hoàn thành</span>;
                                        case OrderStatus.Cancelled:
                                        case OrderStatus.UserCanceled:
                                            return <span className="text-red-500">Đã hủy</span>;
                                        default:
                                            return <span className="text-green-500">---</span>;

                                    }
                                })()
                            }</p>
                            {order.status == OrderStatus.Pending && (
                                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        onClick={(e) => {
                                            setCancelOrderId(order.id);
                                            e.stopPropagation();
                                        }}>Hủy đơn</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <Dialog
                type='error'
                open={!!cancelOrderId}
                onClose={() => setCancelOrderId(null)}
                title='Hủy đơn hàng'
                note='Bạn có chắc chắn muốn hủy đơn hàng này?'
                icon={
                    <Danger size='76' color='#F46161' variant='Bold'/>
                }
                onSubmit={() => cancelOrder.mutate()}
            />
            <Popup open={!!orderDetailId} onClose={() => setOrderDetailId(null)}>
                <DetailOrder orderId={orderDetailId!}/>
            </Popup>
        </>
    );
}

function DetailOrder({orderId}: { orderId: number }) {

    const {data: detailOrder} = useQuery({
        queryFn: () => apiRequest({
            api: () => orderService.getOrderDetail(orderId)
        }),
        select(data: IUserOrderDto) {
            return data;
        },

        enabled: !!orderId,
        queryKey: [QueryKey.detailOrder, orderId]
    })
    console.log("detailOrder", detailOrder);

    return (
        <div className="flex flex-1 flex-col w-[420px] h-[600px] p-4 bg-white rounded-lg ">
            <h2 className="border-b mb-3">Chi tiết đơn hàng <span className="font-semibold">#{detailOrder?.code}</span>
            </h2>
            <div className="overflow-y-scroll">
                {detailOrder?.products.map(product => {
                    return (
                        <div key={product.id}
                             className="flex items-center justify-between py-2 &+&:border-t border-gray-300">
                            <div className="flex items-center gap-2">
                                <Image src={resourceUrl(product.productSize.product.imageUrl)} alt="image"
                                       width={50} height={50}/>
                                <p>{product.productSize.product.name} - {product.productSize.size.name}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p>Số lượng: {product.quantity}</p>
                                <p>Giá: {(product.price * product.quantity).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center justify-between border-t pt-2 mt-2">
                <p>Tổng tiền:</p>
                <p>{detailOrder?.finalAmount.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                })}</p>
            </div>
        </div>
    );
}