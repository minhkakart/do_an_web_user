'use client';
import React from 'react';
import 'react-slideshow-image/dist/styles.css'
import SimpleImageSlider from "react-simple-image-slider";
import {useQuery} from "@tanstack/react-query";
import bannerService from "~/services/apis/bannerService";
import {apiRequest} from "~/services";
import CartItem from "~/components/common/CardItem/CartItem";
import productService from "~/services/apis/productService";
import {ProductSpecial, ProductType, QueryKey} from "~/constants/config/enum";
import {IPageResponse} from "~/commons/interfaces";
import {IProductCartDto} from "~/components/pages/home/interfaces";

function HomePage() {

    const {data: bestSellers, isFetched: loadedBestSellers} = useQuery({
        queryFn: async () => {
            return await apiRequest({
                api: async () => productService.getProducts({
                    page: 1,
                    size: 5,
                    categoryId: null,
                    keyword: '',
                    special: ProductSpecial.BestSeller,
                    type: ProductType.Main
                })
            })
        },
        select(data: IPageResponse<IProductCartDto>) {
            if (!!data) {
                return data;
            }
            return {items: [], pagination: {totalCount: 0, totalPage: 0}} as IPageResponse<IProductCartDto>;
        },
        queryKey: [QueryKey.bestSellers],
    })

    const {data: remarked, isFetched: loadedRemarked} = useQuery({
        queryFn: async () => {
            return await apiRequest({
                api: async () => productService.getProducts({
                    page: 1,
                    size: 5,
                    categoryId: null,
                    keyword: '',
                    special: ProductSpecial.Remarked,
                    type: ProductType.Main
                })
            })
        },
        select(data: IPageResponse<IProductCartDto>) {
            if (!!data) {
                return data;
            }
            return {items: [], pagination: {totalCount: 0, totalPage: 0}} as IPageResponse<IProductCartDto>;
        },
        queryKey: [QueryKey.remarked],
    })

    const {data: listBanner} = useQuery({
        queryFn: () => {
            return apiRequest({
                api: async () => bannerService.getBanner()
            })
        },
        select(data: string[]) {
            if (!!data) {
                return (data.map(x => `${process.env.NEXT_PUBLIC_API}/${x}`));
            }
            return [];
        },
        queryKey: [QueryKey.listBanner],
    })

    return (
        <div className="flex flex-col gap-3 w-full h-full">
            <div className="relative w-full aspect-[2]">
                {listBanner &&
                    <SimpleImageSlider
                        width="100%"
                        height="100%"
                        images={listBanner!}
                        showBullets={true}
                        showNavs={true}
                        autoPlay={true}
                        autoPlayDelay={5}
                        bgColor="#00000000"
                        loop={true}
                    />
                }
            </div>

            {loadedBestSellers &&
                <div className="region-wrapper flex flex-col gap-3 items-center justify-center w-full mt-10">
                    <div className="title text-3xl text-[#006f3c] font-semibold text-center capitalize">
                        Best Sellers
                    </div>
                    <div className="flex flex-wrap gap-8 justify-center w-full">
                        {bestSellers && bestSellers.items.map(item => (
                            <CartItem key={item.id} item={item}/>
                        ))}
                    </div>
                </div>
            }
            {loadedRemarked &&
                <div className="region-wrapper flex flex-col gap-3 items-center justify-center w-full mt-10">
                    <div className="title text-3xl text-[#006f3c] font-semibold text-center capitalize">
                        Sản phẩm nổi bật
                    </div>
                    <div className="flex flex-wrap gap-8 justify-center w-full">
                        {remarked && remarked.items.map(item => (
                            <CartItem key={item.id} item={item}/>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
}

export default HomePage;