import React, {useEffect, useRef, useState} from 'react';
import TippyHeadless from '@tippyjs/react/headless';

import {PropsSelectForm} from './interfaces';
import styles from './SelectForm.module.scss';
import clsx from 'clsx';
import {IoIosArrowDown} from 'react-icons/io';
import {GrSearch} from 'react-icons/gr';
import {RiCloseCircleFill} from 'react-icons/ri';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {removeVietnameseTones} from "~/commons/funcs/optionConvert";

function SelectForm<OptionType>({
	label,
	placeholder,
	isSearch = true,
	readOnly,
	value,
	options,
	onClean,
	onSelect,
	getOptionLabel,
	getOptionValue,
}: PropsSelectForm<OptionType>) {
	const refSelect = useRef<HTMLDivElement>(null);
	const refInputSearch = useRef<HTMLInputElement>(null);

	const [width, setWidth] = useState<number>(0);
	const [keyword, setKeyword] = useState<string>('');
	const [isFocus, setIsFocus] = useState<boolean>(false);

	useEffect(() => {
		const element = refSelect.current;
		if (!element) return;

		const resizeObserver = new ResizeObserver(() => {
			setWidth(element.offsetWidth);
		});

		resizeObserver.observe(element);

		return () => resizeObserver.disconnect();
	}, []);

	const handleSelectClick = () => {
		if (refInputSearch?.current) {
			setTimeout(() => {
				refInputSearch.current?.focus();
			}, 0);
		}
	};

	const handleOptionClick = (option: OptionType) => {
		onSelect?.(option);
		setIsFocus(false);
	};

	const handleClose = () => {
		setIsFocus(false);
		setKeyword('');
	};

	const handlerFocused = () => {
		if (!readOnly) {
			setIsFocus(!isFocus);
			handleSelectClick();
		}
	};

	return (
		<div
			className={clsx(styles.container, {
				[styles.focus]: isFocus,
				[styles.readOnly]: readOnly,
			})}
		>
			{label && <label className={styles.label}>{label}</label>}
			<TippyHeadless
				maxWidth={'100%'}
				interactive
				onClickOutside={handleClose}
				placement='bottom-start'
				visible={isFocus}
				render={(attrs: any) => (
					<div style={{width: width}} className={styles.main_option}>
						{isSearch && (
							<div className={clsx(styles.search_group)}>
								<div className={styles.search_icon}>
									<GrSearch color='#005994' size={20} />
								</div>
								<input
									ref={refInputSearch}
									type='text'
									value={keyword}
									autoFocus={isFocus}
									placeholder='Tìm kiếm...'
									onChange={(e) => setKeyword(e.target.value)}
								/>
							</div>
						)}
						{options?.filter((opt) => {
							const label = removeVietnameseTones(getOptionLabel(opt) || '');
							const key = removeVietnameseTones(keyword || '');
							return label.includes(key);
						})?.length > 0 ? (
							<div className={styles.list_option}>
								{options
									.filter((opt) => {
										const label = removeVietnameseTones(getOptionLabel(opt) || '');
										const key = removeVietnameseTones(keyword || '');
										return label.includes(key);
									})
									?.map((opt) => (
										<div
											key={getOptionValue(opt)}
											className={clsx(styles.option, {
												[styles.active]: getOptionValue(opt) === value,
											})}
											onClick={() => handleOptionClick(opt)}
										>
											{getOptionLabel(opt)}
										</div>
									))}
							</div>
						) : (
							<div className={styles.empty}>
								<Image src={icons.emptyFile} alt='image empty' />
								<p>Danh sách lựa chọn rỗng!</p>
							</div>
						)}
					</div>
				)}
			>
				<div ref={refSelect} className={styles.main_select} onClick={handlerFocused}>
					<p className={clsx(styles.value, {[styles.placeholder]: !value})}>
						{options.find((opt) => getOptionValue(opt) === value)
							? getOptionLabel(options.find((opt) => getOptionValue(opt) === value)!)
							: placeholder}
					</p>
					{onClean && !!value && (
						<div
							className={styles.iconClean}
							onClick={(e) => {
								e.stopPropagation();
								onClean();
							}}
						>
							<RiCloseCircleFill size={18} color='#B1B5C3' />
						</div>
					)}
					<div className={styles.icon}>
						<IoIosArrowDown size={18} />
					</div>
				</div>
			</TippyHeadless>
		</div>
	);
}

export default SelectForm;
