import {IoPersonCircleOutline} from "react-icons/io5";
import Profile from "~/app/(authorized)/personal/Profile";
import {AiOutlineShop} from "react-icons/ai";
import Orders from "~/app/(authorized)/personal/Orders";
import {PiMapPinAreaBold} from "react-icons/pi";
import Addresses from "~/app/(authorized)/personal/Addresses";
import {MdOutlineManageAccounts} from "react-icons/md";
import Account from "~/app/(authorized)/personal/Account";
import {IPersonalNav} from "~/commons/interfaces";

export const APP_NAME = 'USER_EYD';

export const KEY_STORAGE_TOKEN = APP_NAME + '_TOKEN';

export const MAXIMUM_FILE = 10; //MB

export const allowFiles = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
];

export enum Paths {
    Home = '/',
    Login = '/login',
    Personal = '/personal',
    Checkout = '/checkout',
    Product = '/product',
}


export const PageSize = [10, 20, 50, 100];

export const PersonalTabIds = {
    info: 'info',
    orders: 'orders',
    addresses: 'addresses',
    account: 'account',
}

export const PersonalTabs: IPersonalNav[] = [
    {
        id: PersonalTabIds.info,
        name: 'Thông tin cá nhân',
        icon: IoPersonCircleOutline,
        component: Profile,
    },
    {
        id: PersonalTabIds.orders,
        name: 'Đơn hàng của tôi',
        icon: AiOutlineShop,
        component: Orders,
    },
    {
        id: PersonalTabIds.addresses,
        name: 'Địa chỉ của tôi',
        icon: PiMapPinAreaBold,
        component: Addresses,
    },
    {
        id: PersonalTabIds.account,
        name: 'Tài khoản',
        icon: MdOutlineManageAccounts,
        component: Account,
    },
]
