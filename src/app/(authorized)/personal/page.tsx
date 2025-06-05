'use client';
import React, {useCallback, useEffect, useState} from 'react';
import Header from "~/layouts/Header/Header";
import clsx from "clsx";
import {IPersonalNav} from "~/commons/interfaces";
import {PersonalTabIds, PersonalTabs} from "~/constants/config";
import {useRouter, useSearchParams} from "next/navigation";
import {AiOutlineMenuFold} from "react-icons/ai";

function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    const currentParams = new URLSearchParams(searchParams.toString());

    const [currentNav, setCurrentNav] = useState<IPersonalNav | null>(null);
    const [showFullNav, setShowFullNav] = useState<boolean>(window.innerWidth >= 1024);

    const findCurrentNav = useCallback(() => {
        return PersonalTabs.find(nav => nav.id === tab) || null;
    }, [PersonalTabs, tab]);

    const handleResize = useCallback(() => {
        const width = window.innerWidth;
        if (width < 1024) {
            setShowFullNav(false);
        }

    }, [])

    useEffect(() => {
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    useEffect(() => {
        if (!tab) {
            currentParams.set('tab', PersonalTabIds.info);
            router.replace(`?${currentParams.toString()}`);
        }
    }, []);

    useEffect(() => {
        setCurrentNav(findCurrentNav());
    }, [tab]);

    return (
        <>
            <Header showSearch={false} showNav={false}/>
            <div
                className="relative min-h-[calc(100vh-80px)] max-h-screen w-full bg-gray-100 inline-flex overflow-y-hidden mt-[80px]">
                <div id="profile-side"
                     className={clsx("inset-0 z-99 flex flex-col items-center justify-start min-h-full w-[320px] bg-white shadow-md py-4 px-2 shrink-0 gap-3", {
                         'w-fit!': !showFullNav,
                         'max-lg:absolute': showFullNav
                     })}>
                    <div className="flex w-full items-center justify-start">
                        <div className="rounded-lg bg-green-700 p-2"
                             onClick={() => setShowFullNav(!showFullNav)}
                        >
                            <AiOutlineMenuFold style={{cursor: "pointer", width: 28, height: 28, color: "white"}}/>
                        </div>
                    </div>
                    {PersonalTabs.map((nav: IPersonalNav) => {
                        return (
                            <div key={nav.id}
                                 onClick={() => {
                                     currentParams.set('tab', nav.id);
                                     router.replace(`?${currentParams.toString()}`);
                                 }}
                                 className={clsx("flex items-center justify-start w-full text-green-900 bg-green-300 rounded-xl py-2 px-2 hover:cursor-pointer hover:bg-green-400 transition-all gap-2",
                                     {'bg-green-700! text-white': tab === nav.id})}>
                                <nav.icon style={{width: 24, height: 24, fontWeight: 800}}/>
                                {showFullNav && <h1 className="text-xl ">{nav.name}</h1>}
                            </div>
                        );
                    })}
                </div>
                <div id="profile-main-content" className="relative min-h-full w-full bg-gray-200 overflow-y-scroll">
                    <div className="absolute w-full min-h-full overflow-y-scroll bg-white pt-6 pb-12 px-10">
                        {currentNav && <currentNav.component/>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;