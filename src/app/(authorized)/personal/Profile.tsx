'use client';
import React from 'react';
import images from "~/constants/images";
import clsx from "clsx";
import {HiOutlinePencilSquare} from "react-icons/hi2";
import {BsCheck2Circle} from "react-icons/bs";
import UploadSingleFile from "~/components/common/UploadSingleFile/UploadSingleFile";
import Image from "next/image";
import {useQuery} from "@tanstack/react-query";
import {QueryKey} from "~/constants/config/enum";
import {apiRequest} from "~/services";
import userService from "~/services/apis/userService";
import {IUserProfile} from "~/app/(authorized)/personal/interfaces";

function Profile() {
    const nameRef = React.useRef<HTMLInputElement>(null);
    const avatarRef = React.useRef<HTMLInputElement>(null);

    const [changeName, setChangeName] = React.useState<string | null>(null);
    const [changeAvatar, setChangeAvatar] = React.useState<any>({url: images.avatarDefault, file: null});

    console.log('changeAvatar:', changeAvatar);

    const {data: userProfile} = useQuery({
        queryFn: () => apiRequest({
            api: async () => userService.getProfile(),
            showMessageFailed: true
        }),
        select(userProfile: IUserProfile) {
            console.log('user profile', userProfile);
            if (!!userProfile.avatar){
                setChangeAvatar({
                    ...changeAvatar,
                    url: process.env.NEXT_PUBLIC_IMAGE + userProfile.avatar
                })
            }
            return userProfile;
        },
        queryKey: [QueryKey.profile],
    })

    const onClickChangeName = () => {
        if (nameRef.current) {
            setChangeName(nameRef.current.value)
            nameRef.current.disabled = false;
            nameRef.current.focus();
        }
    }

    const onClickSaveName = () => {
        if (nameRef.current) {
            setChangeName(null)
            nameRef.current.disabled = true;
        }
    }

    return (
        <div className="bg-white min-h-full rounded-xl shadow-lg py-5 px-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-col items-start justify-start w-[calc(50%-12px)] shrink-0 min-w-[200px]">
                    <div className="flex flex-col items-center justify-center w-full gap-3">
                        <Image
                            src={changeAvatar.url}
                            alt="avatar" width={150} height={150} style={{borderRadius: '16px'}}/>
                        {/*<div*/}
                        {/*    onClick={onChangeAvatar}*/}
                        {/*    className="w-full max-w-[200px] text-center text-md cursor-pointer transition-all bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-4">*/}
                        {/*    Đổi avatar*/}
                        {/*</div>*/}
                        <UploadSingleFile file={changeAvatar} setFile={setChangeAvatar} text={"Đổi avatar"}
                                          className="items-center justify-center w-full"
                                          btnClassName="w-full max-w-[200px] text-center text-md cursor-pointer transition-all bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-4"/>
                        <input id="input-change-avatar" type="file" hidden ref={avatarRef}/>
                    </div>
                </div>
                <div className="flex flex-col items-start justify-start w-[calc(50%-12px)] shrink-0 min-w-[200px]">
                    <div className="flex flex-col items-start justify-start w-full gap-3">
                        <label htmlFor="fullName" className="block text-2xl font-medium text-gray-600">
                            Tên hiển thị:
                        </label>
                        <div className="relative w-full text-2xl font-medium text-gray-600">
                            <input id="fullName" type="text" disabled value={userProfile?.fullName ?? ""}
                                   ref={nameRef}
                                   className={
                                       clsx("w-full border border-gray-400 rounded-lg px-3 py-2 pr-12",
                                           {
                                               "bg-gray-100": (nameRef?.current?.disabled ?? true),
                                               "text-black!": !(nameRef?.current?.disabled ?? true),
                                           }
                                       )
                                   }
                                   onChange={(e) => setChangeName(e.target.value)}
                            />
                            <ToggleModifier changeCondition={changeName === null}
                                            onChange={onClickChangeName}
                                            onFinish={onClickSaveName}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Profile;

function ToggleModifier({changeCondition, onChange, onFinish}: {
    changeCondition: boolean,
    onChange: () => void,
    onFinish: () => void
}) {
    return (
        <div className="text-black!">
            {
                changeCondition ?
                    <div
                        className="absolute flex right-0 top-1/2 transform -translate-y-1/2 cursor-pointer h-full aspect-square items-center justify-center"
                        onClick={() => onChange()}>
                        <HiOutlinePencilSquare
                            style={{width: 32, height: 32}}/>
                    </div> :
                    <div
                        className="absolute flex right-0 top-1/2 transform -translate-y-1/2 cursor-pointer h-full aspect-square items-center justify-center"
                        onClick={() => onFinish()}>
                        <BsCheck2Circle
                            style={{width: 32, height: 32}}/>
                    </div>
            }
        </div>
    )

}