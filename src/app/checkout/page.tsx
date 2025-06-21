import React from 'react';
import {ICheckoutProps} from "./intefaces";

function Page(props: ICheckoutProps) {
    return (
        <div className="flex flex-col w-full gap-4">
            <h1 className="items-start mt-8">Thanh toán</h1>
            <div className="flex flex-row gap-3 min-h-[400px]">
                <div className="flex flex-1/2 border border-green-500 rounded-lg"></div>
                <div className="flex flex-1/2 border border-green-500 rounded-lg"></div>
            </div>
        </div>
    );
}

export default Page;