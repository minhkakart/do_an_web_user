'use client';
import React from 'react';
import 'react-slideshow-image/dist/styles.css'
import SimpleImageSlider from "react-simple-image-slider";
import {useQuery} from "@tanstack/react-query";
import bannerService from "~/services/apis/bannerService";
import {apiRequest} from "~/services";
import Loading from "~/components/common/Loading";
import CartItem from "~/components/common/CardItem/CartItem";

function HomePage() {

    const bestSellers = [
        {
            id: 1,
            name: "Hồng Trà Đào",
            price: 25000,
            imageUrl: "https://s3-hcmc02.higiocloud.vn/images/2025/02/hong-tra-dao-20250205072158.png"
        },
        {
            id: 2,
            name: "Trà Bá Tước Lựu Đỏ",
            price: 27000,
            imageUrl: "https://s3-hcmc02.higiocloud.vn/images/2025/02/tra-ba-tuoc-luu-do-20250205072548.png"
        },
        {
            id: 3,
            name: "Trà Lucky Tea",
            price: 35000,
            imageUrl: "https://s3-hcmc02.higiocloud.vn/images/2025/02/lucky-tea-20250205072302.png"
        },
        {
            id: 4,
            name: "Trà Ô Long Dâu",
            price: 20000,
            imageUrl: "https://s3-hcmc02.higiocloud.vn/images/2025/02/lucky-tea-20250205072302.png"
        },
        {
            id: 5,
            name: "Trà Ô Long Dâu",
            price: 20000,
            imageUrl: "https://s3-hcmc02.higiocloud.vn/images/2025/02/lucky-tea-20250205072302.png"
        }
    ];

    const {data: listBanner} = useQuery<string[]>({
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
        queryKey: [],
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

            <div className="region-wrapper flex flex-col gap-3 items-center justify-center w-full mt-10">
                <div className="title text-3xl text-[#006f3c] font-semibold text-center capitalize">
                    Best Sellers
                </div>
                <div className="flex flex-wrap gap-8 justify-center w-full">
                    {bestSellers.map(item => (
                        <CartItem key={item.id} item={item}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;