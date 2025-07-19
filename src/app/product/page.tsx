'use client';
import React from 'react';
import {apiRequest} from "~/services";
import productService from "~/services/apis/productService";
import {ProductType, QueryKey} from "~/constants/config/enum";
import {IPageResponse} from "~/commons/interfaces";
import {IProductCartDto} from "~/components/pages/home/interfaces";
import {PageSize} from "~/constants/config";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import categoryService from "~/services/apis/categoryService";
import {ICategoryDto} from "~/app/product/intefaces";
import CardItem from "~/components/common/CardItem/CardItem";
import Loading from "~/components/common/Loading";
import Pagination from "~/components/common/Pagination";

function Page() {
    const [page, setPage] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(PageSize[0]);
    const [keyword, setKeyword] = React.useState<string>('');
    const [categoryFilter, setCategoryFilter] = React.useState<number[]>([]);

    const queryClient = useQueryClient();

    const {data: allCategory} = useQuery({
        queryFn: async () => {
            return await apiRequest({
                api: async () => categoryService.getAll()
            })
        },
        select(data: ICategoryDto[]) {
            if (!!data) {
                return data;
            }
            return [];
        },
        queryKey: [QueryKey.allCategory],
    })

    const {data: products, isLoading} = useQuery({
        queryFn: async () => {
            return await apiRequest({
                api: async () => productService.getProducts({
                    page: page,
                    size: pageSize,
                    categoryIds: categoryFilter,
                    keyword: keyword,
                    special: null,
                    type: ProductType.Main,
                    isPaging: true
                })
            })
        },
        select(data: IPageResponse<IProductCartDto>) {
            if (!!data) {
                return data;
            }
            return {items: [], pagination: {totalCount: 0, totalPage: 0}} as IPageResponse<IProductCartDto>;
        },
        queryKey: [QueryKey.getListProducts, page, pageSize, categoryFilter, keyword],
    })

    return (
        <>
            <Loading loading={isLoading}/>
            <div className="flex w-full pt-10 pb-4 px-12 gap-2">
                <div className="flex flex-col gap-1 p-2 rounded-xl bg-white shadow-lg h-fit">
                    <input type="text" name="keyword" className="border border-gray-400 p-2 max-w-[200px] rounded-md "
                           placeholder="Nhập từ khóa" value={keyword}
                           onChange={(e) => {
                               setKeyword(e.target.value)
                           }}/>
                    <div className="flex flex-wrap max-w-[200px] gap-3">
                        {
                            allCategory?.map((category: ICategoryDto) => (
                                <div key={category.id} className="flex items-center gap-2">
                                    <input type="checkbox" id={`category-${category.id}`}
                                           checked={categoryFilter.includes(category.id)}
                                           onChange={(e) => {
                                               if (e.target.checked) {
                                                   setCategoryFilter([...categoryFilter, category.id]);
                                               } else {
                                                   setCategoryFilter(categoryFilter.filter(id => id !== category.id));
                                               }
                                           }}/>
                                    <label htmlFor={`category-${category.id}`}>{category.name}</label>
                                </div>
                            ))
                        }
                    </div>
                    <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                            onClick={() => {
                                setPage(1);
                                queryClient.invalidateQueries({queryKey: [QueryKey.getListProducts]});
                            }}>
                        Tìm kiếm
                    </button>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                    <div className="flex flex-1 items-start">
                        <div className="flex flex-1 flex-wrap gap-3 justify-start w-full">
                            {products && products.items.map(item => (
                                <CardItem key={item.id} item={item}/>
                            ))}
                        </div>
                    </div>
                    <Pagination
                        page={page}
                        onSetPage={setPage}
                        pageSize={pageSize}
                        onSetPageSize={setPageSize}
                        total={products?.pagination?.totalCount || 0}
                        dependencies={[pageSize, keyword]}
                    />
                </div>
            </div>
        </>
    );
}

export default Page;