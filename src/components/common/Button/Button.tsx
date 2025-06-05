import React from 'react';
import {PropsButton} from './interfaces';
import styles from './Button.module.scss';
import {useStyleClass} from '~/commons/hooks/useStyleClass';
import Link from 'next/link';
import clsx from 'clsx';

function Button({children, onClick, icon, href, className, target, div, wrapperClasses, ...props}: PropsButton) {
	const styleClass = useStyleClass(props, styles);
	const Wrapper: any = href ? Link : onClick ? 'div' : 'button';

	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		if (props.disable) {
			e.preventDefault();
			return;
		}
		onClick?.(e);
	};

	return (
		<Wrapper
			className={clsx("h-fit outline-none border-none bg-transparent select-none", wrapperClasses, {
				[styles.maxContent]: props.maxContent,
				[styles.maxHeight]: props.maxHeight,
			})}
			{...(href ? {href} : {onClick: handleClick})}
		>
			<div className={clsx(styleClass, styles.btn, className)}>
				{icon && <div className={styles.icon}>{icon}</div>}
				<div className={styles.text}>{children}</div>
			</div>
		</Wrapper>
	);
}

export default Button;
