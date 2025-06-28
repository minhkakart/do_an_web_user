'use client';
import React, {useEffect} from 'react';
import Image from "next/image";
import {ProfileCircle} from "iconsax-react";
import Link from "next/link";
import {useSelector} from "react-redux";
import {RootState, store} from "~/redux/store";
import {KEY_STORAGE_TOKEN, Paths, PersonalTabIds, PersonalTabs} from "~/constants/config";
import Tippy from "@tippyjs/react";
import TippyHeadless from '@tippyjs/react/headless';
import {IoPersonCircleOutline} from "react-icons/io5";
import {AiOutlineShop, AiOutlineShoppingCart} from "react-icons/ai";
import {TbLogout2} from "react-icons/tb";
import {useMutation, useQuery} from "@tanstack/react-query";
import {apiRequest} from "~/services";
import authService from "~/services/apis/authService";
import {useRouter} from "next/navigation";
import {deleteItemStorage} from "~/commons/funcs/localStorage";
import {logout, setIsLoggedIn} from "~/redux/appReducer";
import CartUser from "~/layouts/Header/Cart/CartUser";
import images from "~/constants/images/images";
import productService from "~/services/apis/productService";
import {IPageResponse} from "~/commons/interfaces";
import {IProductCartDto} from "~/components/pages/home/interfaces";
import {ProductType, QueryKey} from "~/constants/config/enum";
import CardItem from "~/components/common/CardItem/CardItem";
import Popup from "~/components/common/Popup";

function Header({showSearch = true, showNav = true}: { showSearch?: boolean, showNav?: boolean }) {
    const userData = useSelector((state: RootState) => state.userData);
    const [searchKeyword, setSearchKeyword] = React.useState<string | null>(null);

    const [showAvatarMenu, setShowAvatarMenu] = React.useState(false);

    return (
        <div className="fixed inset-y-0 z-99 w-full bg-green-300 h-[80px] flex items-center justify-center px-4">
            <div id="header-container" className="container flex items-center justify-between">
                <Link href={Paths.Home} id="logo" className="flex items-center justify-center">
                    <Image src={images.logo} alt="Logo" width={100} height={100} className="w-[64px] h-[64px]"/>
                    <h1 className="uppercase font-bold text-2xl w-[180px] text-center text-blue-700">
                        Enjoy Your Drinks
                    </h1>
                </Link>
                {showSearch &&
                    <div className="relative border border-gray-200 rounded-md shadow-lg">
                        <input placeholder="Tìm kiếm" type="text"
                               value={searchKeyword || ""}
                               onChange={(e) => {
                                   if (e.target.value.trim() === '') {
                                       setSearchKeyword(null);
                                   } else {
                                       setSearchKeyword(e.target.value);
                                   }
                               }}
                               className="bg-white w-[400px] pl-4 py-2 pr-[120px] rounded-md"/>
                        {/*<button*/}
                        {/*    className="absolute right-0 top-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-md hover:cursor-pointer active:bg-green-600 transition-colors duration-75">*/}
                        {/*    Tìm kiếm*/}
                        {/*</button>*/}

                        <Popup open={!!searchKeyword} onClose={() => setSearchKeyword(null)} portal={false}>
                            <SearchResult search={searchKeyword}/>
                        </Popup>

                    </div>
                }

                <div id="user-info" className="flex items-center gap-4">

                    <div className="flex items-center gap-2">
                        {userData === null ?
                            <CartUserAnonymous/> :
                            <CartUser/>
                        }
                        {userData === null ?
                            <Link href={Paths.Login} className="outline-none!">
                                <Tippy content="Đăng nhập">
                                    <ProfileCircle size="32" color="black"/>
                                </Tippy>
                            </Link> :
                            <TippyHeadless
                                maxWidth={'100%'}
                                interactive
                                visible={showAvatarMenu}
                                onClickOutside={() => setShowAvatarMenu(false)}
                                placement='bottom-end'
                                render={(attrs: any) => <AvatarMenu onClose={() => setShowAvatarMenu(false)}/>}
                            >
                                <div className="relative" onClick={() => setShowAvatarMenu(!showAvatarMenu)}>
                                    <Image
                                        src={(!!userData.avatar) ? `${process.env.NEXT_PUBLIC_API}/${userData.avatar}` : images.avatarDefault}
                                        alt="User" width={32} height={32}
                                        objectFit={'cover'}
                                        className="w-[32px] h-[32px] rounded-full object-cover"/>
                                </div>
                            </TippyHeadless>

                        }
                    </div>

                </div>
            </div>
            {/*{showNav &&*/}
            {/*    <div id="header-menu"*/}
            {/*         className="absolute top-[80px] left-0 z-99 w-full bg-white shadow-lg flex items-center justify-center">*/}
            {/*        <div className="container flex items-center justify-center gap-12 py-2">*/}
            {/*            <Link href="/" className="text-gray-700 hover:text-green-700!">Trang chủ</Link>*/}
            {/*            <Link href="#" className="text-gray-700 hover:text-green-700!">Sản phẩm</Link>*/}
            {/*            <Link href="#" className="text-gray-700 hover:text-green-700!">Khuyến mãi</Link>*/}
            {/*            <Link href="#" className="text-gray-700 hover:text-green-700!">Liên hệ</Link>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*}*/}
        </div>
    );
}

export default Header;

function AvatarMenu({onClose}: { onClose: () => void }) {
    const router = useRouter();

    const logoutFunc = useMutation({
        mutationFn: () => apiRequest({
            api: async () => authService.logout()
        }),
        onSuccess() {
            deleteItemStorage(KEY_STORAGE_TOKEN);
            store.dispatch(logout());
            onClose();
            router.replace(Paths.Home);
            store.dispatch(setIsLoggedIn(false));
        }
    })

    const handleLogout = () => {
        logoutFunc.mutate();
    };

    return (
        <div
            className="absolute z-99 right-0 top-[calc(100%+8px)] bg-white shadow-lg rounded-md w-[200px] flex flex-col">
            <Link href={Paths.Personal}
                  className="px-4 py-2 hover:bg-gray-100 hover:rounded-t-md cursor-pointer flex flex-row items-center justify-start gap-2 transition-all hover:text-green-700!">
                <IoPersonCircleOutline style={{width: 24, height: 24, color: 'inherit'}}/>
                <span>Thông tin cá nhân</span>
            </Link>
            <Link
                href={`${Paths.Personal}?tab=${PersonalTabIds.orders}`}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row items-center justify-start gap-2 transition-all hover:text-green-700">
                <AiOutlineShop style={{width: 24, height: 24, color: 'inherit'}}/>
                <span>Đơn hàng của tôi</span>
            </Link>
            <div
                className="px-4 py-2 hover:bg-gray-100 hover:rounded-b-md cursor-pointer flex flex-row items-center justify-start gap-2 transition-all hover:text-green-700"
                onClick={handleLogout}
            >
                <TbLogout2 style={{width: 24, height: 24, color: 'inherit'}}/>
                <span>Đăng xuất</span>
            </div>
        </div>
    );
}

function CartUserAnonymous() {
    return (
        <div className="relative cursor-pointer">
            <AiOutlineShoppingCart
                style={{
                    width: 32,
                    height: 32,
                    color: 'black',
                    transform: 'scaleX(-1)',
                    transformOrigin: 'center center'
                }}
            />
            <span
                className="absolute text-sm text-white bg-red-600 rounded-full top-[calc(-10%)] left-[calc(-20%)] w-[16px] h-[16px] flex items-center justify-center">0</span>
        </div>
    );
}

interface ISearchResultProps {
    search: string | null
}

function SearchResult({search = null}: ISearchResultProps) {
    const [keyword, setKeyword] = React.useState<string | null>(search);

    const {data: listSearch, isFetched} = useQuery({
        queryFn: async () => {
            return await apiRequest({
                api: async () => productService.getProducts({
                    page: 1,
                    size: 5,
                    keyword: search || '',
                    categoryId: null,
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
        enabled: !!keyword,
        queryKey: [QueryKey.listProductSearch, keyword],
    })

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setKeyword(search)
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [search]);

    return (
        <div
            className="bg-white shadow-lg rounded-md max-w-[600px] h-fit p-4 overflow-x-scroll z-150 absolute top-[calc(100%+8px)] left-0 flex gap-4">
            {isFetched && listSearch && listSearch.items.map(item => (
                <CardItem key={item.id} item={item}/>
            ))}
            {isFetched && listSearch && listSearch.items.length === 0 &&
                <div className="text-gray-500">Không tìm thấy kết quả nào</div>
            }
        </div>
    )
}