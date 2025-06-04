'use client';
import React, {useRef} from 'react';
import Image from "next/image";
import {AddSquare} from "iconsax-react";
import clsx from "clsx";

export interface IPropsUploadSingleFile {
    file: any;
    setFile: (file: any) => void;
    text?: string;
    isImage?: boolean;
    btnClassName?: string;
    imageClassName?: string;
    className?: string;
    width?: number;
    height?: number;
}

function UploadSingleFile({
                              file,
                              setFile,
                              text = "Chọn file",
                              isImage = false,
                              btnClassName = "",
                              imageClassName = "",
                              className = "",
                              width = 100,
                              height = 100,
                          }: IPropsUploadSingleFile) {
    const fileInputRef = useRef<any>(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event: any) => {
        const selectedFile = event.target.files[0];
        const url = URL.createObjectURL(selectedFile);
        setFile({url, file: selectedFile});

    };

    return (
        <div className={clsx("flex flex-col w-full h-full gap-3", className)}>
            {isImage &&
                <div
                    className={clsx("relative rounded-md overflow-hidden select-none flex-auto", imageClassName)}>
                    {(file && file !== '') ?
                        <Image
                            src={file?.url || file?.path || (file?.resource && (process.env.NEXT_PUBLIC_IMAGE + file?.resource)) || (process.env.NEXT_PUBLIC_IMAGE + file)}
                            width={width}
                            height={height}
                            alt='image' objectFit='contain'/> :
                        <div
                            className="flex items-center justify-center w-full h-full bg-[rgba(153,162,179,0.3)] hover:cursor-pointer"
                            onClick={handleClick}
                        >
                            <AddSquare size="100" color="#FFF"/>
                        </div>
                    }
                </div>
            }
            <div
                className={clsx("flex items-center justify-center w-fit bg-blue-900 text-white rounded-md cursor-pointer py-2", btnClassName)}
                onClick={handleClick}
            >
                {text}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
            />
        </div>
    );
}

export default UploadSingleFile;