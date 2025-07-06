'use client';

import {useEffect, useState} from 'react';

import clsx from 'clsx';

function SwitchButton({onChange, value, name}: any) {
    const [checked, setChecked] = useState<boolean>(value);

    useEffect(() => {
        setChecked(value);
    }, [value]);

    return (
        <div
            className={clsx('relative bg-gray-400 w-[40px] h-[20px] rounded-3xl cursor-pointer select-none', {'bg-blue-500! after:left-[23px]': checked}, 'after:content-[""] after:absolute after:left-[3px] after:top-1/2 after:-translate-y-1/2 after:w-[14px] after:h-[14px] after:rounded-[50%] after:bg-white after:transition-all')}
            onClick={() => {
                setChecked(!checked);
                onChange &&
                onChange({
                    target: {
                        value: !checked,
                        name: name ? name : null,
                    },
                });
            }}
        ></div>
    );
}

export default SwitchButton;
