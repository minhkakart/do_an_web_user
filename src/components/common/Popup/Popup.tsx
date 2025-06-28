'use client';

import React, {Fragment, memo, useEffect} from 'react';
import Portal from '../Portal';
import clsx from 'clsx';
import style from './Popup.module.scss';

interface props {
    open: boolean;
    isFull?: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    showOverlay?: boolean;
    portal?: boolean;

    [props: string]: any;
}

function Overlay({open, onClose, showOverlay = true, isFull, children, portal = true}: props) {
    useEffect(() => {
        if (open) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'overlay';
        }

        return () => {
            document.body.style.overflowY = 'overlay';
        };
    }, [open]);

    return (
        <Fragment>
            {open && (
                <Portal isPortal={portal}>
                    {showOverlay && <div className={clsx(style.overlay, 'click', {"opacity-0!": !portal})} onClick={onClose}></div>}
                    <div className={clsx({[style.isFull]: isFull, [style.main]: portal})}>{children}</div>
                </Portal>

            )}
        </Fragment>
    );
}

export default memo(Overlay);
