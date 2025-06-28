import React from 'react';

function Footer() {
    return (
        <div className="flex justify-between w-full bg-green-300 py-10 px-[200px]">
            <div className="flex justify-center items-center">
                {/*<Image src={images.logo} alt="Logo" width={50} height={50} className="w-[64px] h-[64px]"/>*/}
                <h1 className="text-md text-start">
                    <span className="font-bold">Liên hệ và hỗ trợ: </span><br/>
                    <span className="text-blue-700">Email: eyd-shop@gmail.com</span><br/>
                    <span className="text-blue-700">SĐT: (+84) 963955104</span><br/>
                </h1>
            </div>
        </div>
    );
}

export default Footer;