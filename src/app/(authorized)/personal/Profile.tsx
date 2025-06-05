'use client';
import React, {useEffect} from 'react';
import images from "~/constants/images";
import clsx from "clsx";
import {HiOutlinePencilSquare} from "react-icons/hi2";
import {BsCheck2Circle} from "react-icons/bs";
import UploadSingleFile from "~/components/common/UploadSingleFile/UploadSingleFile";
import Image from "next/image";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {QueryKey, TypeGender} from "~/constants/config/enum";
import {apiRequest} from "~/services";
import userService from "~/services/apis/userService";
import {IUpdateProfileRequest, IUserProfile} from "~/app/(authorized)/personal/interfaces";
import Loading from "~/components/common/Loading";
import {useSelector} from "react-redux";
import {RootState, store} from "~/redux/store";
import {setUserData, UserData} from "~/redux/appReducer";
import {IoCloseCircleOutline} from "react-icons/io5";

function Profile() {
    const queryClient = useQueryClient();

    const userData: UserData | null = useSelector((state: RootState) => state.userData);

    const avatarRef = React.useRef<HTMLInputElement>(null);
    const nameRef = React.useRef<HTMLInputElement>(null);
    const phoneRef = React.useRef<HTMLInputElement>(null);
    const emailRef = React.useRef<HTMLInputElement>(null);
    const birthRef = React.useRef<HTMLInputElement>(null);
    const genderRef = React.useRef<HTMLSelectElement>(null);

    const [changeAvatar, setChangeAvatar] = React.useState<any>({url: images.avatarDefault, file: null});
    const [changingName, setChangingName] = React.useState<boolean>(false);
    const [changingPhone, setChangingPhone] = React.useState<boolean>(false);
    const [changingEmail, setChangingEmail] = React.useState<boolean>(false);
    const [changingBirth, setChangingBirth] = React.useState<boolean>(false);
    const [changingGender, setChangingGender] = React.useState<boolean>(false);

    const [formProfile, setFormProfile] = React.useState<IUpdateProfileRequest>({
        fullName: "",
        gender: TypeGender.Male,
        email: null,
        phone: null,
        birthday: null,
    })

    const {data: userProfile, isFetched} = useQuery({
        queryFn: () => apiRequest({
            api: async () => userService.getProfile(),
            showMessageFailed: true
        }),
        select(userProfile: IUserProfile) {
            return userProfile;
        },
        queryKey: [QueryKey.profile],
    })

    useEffect(() => {
        if (userProfile) {
            if (userProfile.avatar) {
                setChangeAvatar({
                    url: process.env.NEXT_PUBLIC_API + "/" + userProfile.avatar,
                    file: null
                })
            }
            setFormProfile({
                ...userProfile
            });
        }
    }, [isFetched]);

    const cancelChangeAvatar = () => {
        setChangeAvatar({
            url: (userProfile && userProfile.avatar) ? process.env.NEXT_PUBLIC_API + "/" + userProfile.avatar : images.avatarDefault,
            file: null
        });
        if (avatarRef.current) {
            avatarRef.current.value = '';
        }
    }

    const clickChange = (ref: React.RefObject<HTMLInputElement | HTMLSelectElement | null>, setter: () => void) => {
        if (ref.current) {
            setter();
            ref.current.disabled = false;
            ref.current.focus();
        }
    }

    const saveChange = (ref: React.RefObject<HTMLInputElement | HTMLSelectElement | null>, setter: () => void, mutationFunc: () => void) => {
        if (ref.current) {
            setter();
            ref.current.disabled = true;
            mutationFunc();
        }
    }

    const cancelChange = (ref: React.RefObject<HTMLInputElement | HTMLSelectElement | null>, setter: () => void, cleanUp: () => void) => {
        if (ref.current) {
            setter();
            ref.current.disabled = true;
            cleanUp();
        }
    }

    const changeAvatarMutation = useMutation({
        mutationFn: () => apiRequest({
            api: async () => userService.updateAvatar(changeAvatar.file),
            showMessageFailed: true,
            showMessageSuccess: true,
            msgSuccess: "Cập nhật avatar thành công",
        }),
        async onSuccess(data: string) {
            store.dispatch(setUserData({
                id: userData?.id ?? "",
                fullName: userData?.fullName ?? "",
                avatar: data || null,
                role: userData?.role ?? 0
            }))
            setChangeAvatar({
                ...changeAvatar,
                file: null
            });
            if (avatarRef.current) {
                avatarRef.current.value = '';
            }
            await queryClient.invalidateQueries({queryKey: [QueryKey.profile]});
        }
    })

    const changeProfileMutation = useMutation({
        mutationFn: (msg?: string) => apiRequest({
            api: async () => userService.updateProfile(formProfile),
            showMessageSuccess: true,
            showMessageFailed: true,
            msgSuccess: msg || "Cập nhật thành công.",
        }),
        async onSuccess() {
            store.dispatch(setUserData({
                id: userData?.id ?? "",
                fullName: formProfile.fullName,
                avatar: userData?.avatar || null,
                role: userData!.role
            }))
            await queryClient.invalidateQueries({queryKey: [QueryKey.profile]});
        }
    })

    return (
        <>
            <Loading loading={changeAvatarMutation.isPending || changeProfileMutation.isPending}/>
            <div className="bg-white min-w-fit gap-5 flex flex-col">
                <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-col items-start justify-start w-[calc(50%-12px)] shrink-0 min-w-[150px] max-sm:w-full">
                        <div className="flex flex-col items-center justify-center w-full gap-3">
                            <Image
                                src={changeAvatar.url}
                                alt="avatar" width={150} height={150}
                                className="rounded-full object-cover bg-no-repeat w-[150px] h-[150px]"
                            />
                            {
                                !changeAvatar.file ?
                                    <UploadSingleFile file={changeAvatar} setFile={setChangeAvatar} text={"Đổi avatar"}
                                                      className="items-center justify-center w-full"
                                                      btnClassName="max-w-[200px] text-center text-md cursor-pointer transition-all bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-4"/>
                                    :
                                    <div className="flex items-center justify-center w-fit gap-3">
                                        <div
                                            onClick={() => changeAvatarMutation.mutate()}
                                            className="text-center text-md cursor-pointer transition-all bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-4">Lưu
                                        </div>
                                        <div
                                            onClick={cancelChangeAvatar}
                                            className="text-center text-md cursor-pointer transition-all bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 px-4">Hủy
                                        </div>
                                    </div>

                            }
                            <input id="input-change-avatar" type="file" hidden ref={avatarRef}/>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-start w-[calc(50%-12px)] shrink-0 min-w-[150px] max-sm:w-full">
                        <div className="flex flex-col items-start justify-start w-full gap-3">
                            <label htmlFor="fullName" className="block text-2xl font-medium text-gray-600">
                                Tên hiển thị:
                            </label>
                            <div className="relative w-full text-2xl font-medium text-gray-600">
                                <input id="fullName" type="text" disabled value={formProfile.fullName}
                                       ref={nameRef}
                                       className={
                                           clsx("w-full border border-gray-400 rounded-lg px-3 py-2 pr-12",
                                               {
                                                   "bg-gray-100": (nameRef?.current?.disabled ?? true),
                                                   "text-black!": !(nameRef?.current?.disabled ?? true),
                                               }
                                           )
                                       }
                                       onChange={(e) => {
                                           setFormProfile({
                                               ...formProfile,
                                               fullName: e.target.value
                                           });
                                       }}
                                />
                                <ToggleModifier
                                    changeCondition={changingName}
                                    onChange={() => clickChange(nameRef, () => setChangingName(true))}
                                    onCancel={() => cancelChange(nameRef, () => setChangingName(false), () => {
                                        setFormProfile({
                                            ...formProfile,
                                            fullName: userProfile?.fullName || ""
                                        })
                                    })}
                                    onSave={() => {
                                        saveChange(nameRef, () => setChangingName(false), () => changeProfileMutation.mutate("Cập nhật tên hiển thị thành công."));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-col items-start justify-start w-[calc(50%-12px)] shrink-0 min-w-[150px] max-sm:w-full">
                        <div className="flex flex-col items-start justify-start w-full gap-3">
                            <label htmlFor="phone" className="block text-2xl font-medium text-gray-600">
                                Số điện thoại:
                            </label>
                            <div className="relative w-full text-2xl font-medium text-gray-600">
                                <input id="phone" type="text" disabled value={formProfile.phone || ""}
                                       placeholder="Nhập số điện thoại"
                                       ref={phoneRef}
                                       className={
                                           clsx("w-full border border-gray-400 rounded-lg px-3 py-2 pr-12",
                                               {
                                                   "bg-gray-100": (phoneRef?.current?.disabled ?? true),
                                                   "text-black!": !(phoneRef?.current?.disabled ?? true),
                                               }
                                           )
                                       }
                                       onChange={(e) => {
                                           setFormProfile({
                                               ...formProfile,
                                               phone: e.target.value === "" ? null : e.target.value
                                           });
                                       }}
                                />
                                <ToggleModifier
                                    changeCondition={changingPhone}
                                    onChange={() => clickChange(phoneRef, () => setChangingPhone(true))}
                                    onCancel={() => cancelChange(phoneRef, () => setChangingPhone(false), () => {
                                        setFormProfile({
                                            ...formProfile,
                                            phone: userProfile?.phone ?? null
                                        })
                                    })}
                                    onSave={() => {
                                        saveChange(phoneRef, () => setChangingPhone(false), () => changeProfileMutation.mutate("Cập nhật số điện thoại thành công."));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-start w-[calc(50%-12px)] shrink-0 min-w-[150px] max-sm:w-full">
                        <div className="flex flex-col items-start justify-start w-full gap-3">
                            <label htmlFor="phone" className="block text-2xl font-medium text-gray-600">
                                Email:
                            </label>
                            <div className="relative w-full text-2xl font-medium text-gray-600">
                                <input id="email" type="text" disabled value={formProfile.email || ""}
                                       placeholder="Nhập email"
                                       ref={emailRef}
                                       className={
                                           clsx("w-full border border-gray-400 rounded-lg px-3 py-2 pr-12",
                                               {
                                                   "bg-gray-100": (emailRef?.current?.disabled ?? true),
                                                   "text-black!": !(emailRef?.current?.disabled ?? true),
                                               }
                                           )
                                       }
                                       onChange={(e) => {
                                           setFormProfile({
                                               ...formProfile,
                                               email: e.target.value === "" ? null : e.target.value
                                           });
                                       }}
                                />
                                <ToggleModifier
                                    changeCondition={changingEmail}
                                    onChange={() => clickChange(emailRef, () => setChangingEmail(true))}
                                    onCancel={() => cancelChange(emailRef, () => setChangingEmail(false), () => {
                                        setFormProfile({
                                            ...formProfile,
                                            email: userProfile?.email ?? null
                                        })
                                    })}
                                    onSave={() => {
                                        saveChange(emailRef, () => setChangingEmail(false), () => changeProfileMutation.mutate("Cập nhật email thành công."));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-col items-start justify-start w-[calc(50%-12px)] shrink-0 min-w-[150px] max-sm:w-full">
                        <div className="flex flex-col items-start justify-start w-full gap-3">
                            <label htmlFor="phone" className="block text-2xl font-medium text-gray-600">
                                Ngày sinh:
                            </label>
                            <div className="relative w-full text-2xl font-medium text-gray-600">
                                <input id="birthday" type="date" disabled value={formProfile.birthday || ""}
                                       placeholder="Nhập ngày sinh"
                                       ref={birthRef}
                                       className={
                                           clsx("w-full border border-gray-400 rounded-lg px-3 py-2 pr-16",
                                               {
                                                   "bg-gray-100": (birthRef?.current?.disabled ?? true),
                                                   "text-black!": !(birthRef?.current?.disabled ?? true),
                                               }
                                           )
                                       }
                                       onChange={(e) => {
                                           setFormProfile({
                                               ...formProfile,
                                               birthday: e.target.value === "" ? null : e.target.value
                                           });
                                       }}
                                />
                                <ToggleModifier
                                    changeCondition={changingBirth}
                                    onChange={() => clickChange(birthRef, () => setChangingBirth(true))}
                                    onCancel={() => cancelChange(birthRef, () => setChangingBirth(false), () => {
                                        setFormProfile({
                                            ...formProfile,
                                            birthday: userProfile?.birthday ?? null
                                        })
                                    })}
                                    onSave={() => {
                                        saveChange(birthRef, () => setChangingBirth(false), () => changeProfileMutation.mutate("Cập nhật ngày sinh thành công."));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-start w-[calc(50%-12px)] shrink-0 min-w-[150px] max-sm:w-full">
                        <div className="flex flex-col items-start justify-start w-full gap-3">
                            <label htmlFor="gender" className="block text-2xl font-medium text-gray-600">
                                Giới tính:
                            </label>
                            <div className="relative w-full text-2xl font-medium text-gray-600">
                                <select name="gender" id="gender"
                                        ref={genderRef}
                                        disabled={!changingGender}
                                        onChange={(e: any) => {
                                            setFormProfile({
                                                ...formProfile,
                                                gender: e.target.value
                                            })
                                        }}
                                        className={
                                            clsx("w-full border border-gray-400 rounded-lg px-3 py-2 pr-16",
                                                {
                                                    "bg-gray-100": (genderRef?.current?.disabled ?? true),
                                                    "text-black!": !(genderRef?.current?.disabled ?? true),
                                                }
                                            )
                                        }
                                        value={formProfile.gender}
                                >
                                    <option value={0}>Nam</option>
                                    <option value={1}>Nữ</option>
                                </select>
                                <ToggleModifier
                                    changeCondition={changingGender}
                                    onChange={() => clickChange(genderRef, () => setChangingGender(true))}
                                    onCancel={() => cancelChange(genderRef, () => setChangingGender(false), () => {
                                        setFormProfile({
                                            ...formProfile,
                                            gender: userProfile?.gender ?? 0
                                        })
                                    })}
                                    onSave={() => {
                                        saveChange(genderRef, () => setChangingGender(false), () => {
                                            changeProfileMutation.mutate("Cập nhật giới tính thành công.")
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Profile;

function ToggleModifier({changeCondition, onChange, onCancel, onSave}: {
    changeCondition: boolean,
    onChange: () => void,
    onCancel: () => void,
    onSave: () => void
}) {
    return (
        <div className="text-black!">
            {
                changeCondition ?
                    <div
                        className="absolute z-999 flex right-0 top-1/2 transform -translate-y-1/2 cursor-pointer h-full aspect-auto items-center justify-center">
                        <IoCloseCircleOutline
                            onClick={(e) => {
                                e.preventDefault();
                                onCancel();
                            }}
                            style={{width: 32, height: 32, color: "#ff2d55"}}/>
                        <BsCheck2Circle
                            onClick={(e) => {
                                e.preventDefault();
                                onSave();
                            }}
                            style={{width: 32, height: 32, color: "#4cd964"}}/>
                    </div>
                    :
                    <div
                        className="absolute z-999 flex right-0 top-1/2 transform -translate-y-1/2 cursor-pointer h-full aspect-square items-center justify-center"
                        onClick={(e) => {
                            e.preventDefault();
                            onChange();
                        }}>
                        <HiOutlinePencilSquare
                            style={{width: 32, height: 32, color: "#4a5565"}}/>
                    </div>
            }
        </div>
    )

}