import styles from './IconToastifyCustom.module.scss';
import {FaCheckCircle} from 'react-icons/fa';
import clsx from 'clsx';
import {MdOutlineVerified} from 'react-icons/md';
import {PiWarningCircle} from 'react-icons/pi';
import {PropsIconToastifyCustom} from './interfaces';

function IconToastifyCustom({type}: PropsIconToastifyCustom) {
	return (
		<div
			className={clsx(
				{
					[styles.success]: type == 'success',
					[styles.info]: type == 'info',
					[styles.warn]: type == 'warn',
					[styles.error]: type == 'error',
				},
				styles.icon
			)}
		>
			{type == 'success' && (
				<div>
					<FaCheckCircle size='20' color='#fff' />
				</div>
			)}
			{type == 'info' && (
				<div>
					<FaCheckCircle size='20' color='#fff' />
				</div>
			)}
			{type == 'warn' && (
				<div>
					<PiWarningCircle size='20' color='#fff' />
				</div>
			)}
			{type == 'error' && (
				<div>
					<MdOutlineVerified size='20' color='#fff' />
				</div>
			)}
		</div>
	);
}

export default IconToastifyCustom;
