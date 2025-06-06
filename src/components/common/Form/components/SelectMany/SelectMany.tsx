'use client';
import React, {Fragment, useEffect, useRef, useState} from 'react';

import {PropsSelectMany} from './interfaces';
import styles from './SelectMany.module.scss';
import clsx from 'clsx';
import {AddCircle} from 'iconsax-react';
import {GrSearch} from 'react-icons/gr';
import {removeVietnameseTones} from '~/commons/funcs/optionConvert';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {IoClose} from 'react-icons/io5';
import Popup from '~/components/common/Popup';
import Button from '~/components/common/Button';

function SelectMany<OptionType>({
	text,
	label,
	placeholder,
	isSearch = true,
	showSelectedItems = true,
	readOnly,
	disabledItems = [],
	selectedItems = [],
	options = [],
	title,
	onClickSelect,
	setSelectedItems,
	getOptionLabel,
	getOptionValue,
	onRemove,
}: PropsSelectMany<OptionType>) {
	const refSelect = useRef<HTMLDivElement>(null);

	const refInputSearch = useRef<HTMLInputElement>(null);

	const [keyword, setKeyword] = useState<string>('');
	const [isFocus, setIsFocus] = useState<boolean>(false);
	const [listDataTerm, setlistDataTerm] = useState<Array<string | number>>([]);

	useEffect(() => {
		if (isFocus && refInputSearch?.current) {
			setTimeout(() => {
				refInputSearch.current?.focus();
			}, 0);
		}
	}, [isFocus]);

	useEffect(() => {
		setlistDataTerm(selectedItems);
	}, [isFocus]);

	const handleOptionClick = (option: OptionType) => {
		if (!disabledItems.includes(getOptionValue(option))) {
			const optionValue = listDataTerm?.find((v) => v == getOptionValue(option));

			if (optionValue) {
				setlistDataTerm((prev) => prev?.filter((v) => v != getOptionValue(option)));
			} else {
				setlistDataTerm((prev) => [...prev, getOptionValue(option)]);
			}
			setKeyword('');
		}
	};

	const handleRemoveSelected = (itemValue: string | number) => {
		if (onRemove) onRemove(itemValue);
		const updated = listDataTerm.filter((v) => v !== itemValue);
		setlistDataTerm(updated);
		setSelectedItems?.(updated);
	};

	const handlerFocused = () => {
		if (onClickSelect) {
			onClickSelect();
		} else {
			if (!readOnly) {
				setIsFocus(!isFocus);
			}
		}
	};

	const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e?.target;

		if (checked) {
			setlistDataTerm(options?.map((v) => getOptionValue(v)));
		} else {
			setlistDataTerm([]);
		}
	};

	const handleClose = () => {
		setKeyword('');
		setIsFocus(false);
		setlistDataTerm(selectedItems);
		setSelectedItems && setSelectedItems(selectedItems);
	};

	const handleSaveData = () => {
		setKeyword('');
		setIsFocus(false);
		setSelectedItems && setSelectedItems(listDataTerm || []);
	};

	return (
		<Fragment>
			<div
				className={clsx(styles.container, {
					[styles.focus]: isFocus,
					[styles.readOnly]: readOnly,
				})}
			>
				{label && <label className={styles.label}>{label}</label>}
				<div ref={refSelect} className={styles.main_select} onClick={handlerFocused}>
					<p className={clsx(styles.value, {[styles.placeholder]: selectedItems.length === 0})}>
						{selectedItems?.length > 0 ? `Đã chọn ${selectedItems.length} ${text}` : placeholder}
					</p>
					<div className={styles.icon}>
						<AddCircle size={20} variant='Bold' />
					</div>
				</div>

				{showSelectedItems && (
					<div className={styles.list_selected}>
						{selectedItems
							?.map((v) => {
								const opt = options.find((f) => getOptionValue(f) === v);
								return opt;
							})
							?.filter(Boolean)
							?.map((selected) => (
								<div
									key={getOptionValue(selected!)}
									className={clsx(styles.selected, {
										[styles.disabled]: disabledItems.includes(getOptionValue(selected!)),
									})}
								>
									<p>{getOptionLabel(selected!)}</p>
									<div className={styles.icon_selected} onClick={() => handleRemoveSelected(getOptionValue(selected!))}>
										<IoClose />
									</div>
								</div>
							))}
					</div>
				)}
			</div>

			<Popup open={isFocus} onClose={handleClose}>
				<div className={styles.main_popup}>
					<h4 className={styles.title}>{title || 'Danh sách'}</h4>
					{isSearch && (
						<div className={clsx(styles.search_group)}>
							<div className={styles.search_icon}>
								<GrSearch color='#3772FF' size={20} />
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
					{options.filter((opt) =>
						removeVietnameseTones(getOptionLabel(opt) || '').includes(removeVietnameseTones(keyword || ''))
					).length > 0 ? (
						<div className={clsx(styles.select_all, {[styles.isShowCheckAll]: !isSearch})}>
							<div className={clsx(styles.option, styles.notBorder)}>
								<input
									id='check_all'
									type='checkbox'
									className={styles.checkbox}
									onChange={handleCheckAll}
									checked={listDataTerm.length == options.length}
								/>
								<label htmlFor='check_all' className={styles.label_check_all}>
									Chọn tất cả
								</label>
							</div>

							<p className={styles.count_selected}>
								Đã chọn: <span>{listDataTerm.length}</span>
							</p>
						</div>
					) : null}

					{options.filter((opt) =>
						removeVietnameseTones(getOptionLabel(opt) || '').includes(removeVietnameseTones(keyword || ''))
					).length > 0 ? (
						<div className={styles.list_option}>
							{options
								.filter((opt) =>
									removeVietnameseTones(getOptionLabel(opt) || '').includes(removeVietnameseTones(keyword || ''))
								)
								.map((opt) => (
									<div key={getOptionValue(opt)} className={styles.option}>
										<input
											type='checkbox'
											id={getOptionValue(opt).toString()}
											className={styles.checkbox}
											onChange={() => handleOptionClick(opt)}
											checked={listDataTerm?.some((v) => v == getOptionValue(opt))}
											disabled={disabledItems.includes(getOptionValue(opt))}
										/>
										<label htmlFor={getOptionValue(opt).toString()} className={styles.label_check_item}>
											{getOptionLabel(opt)}
										</label>
									</div>
								))}
						</div>
					) : (
						<div className={styles.empty}>
							<Image src={icons.emptyFile} alt='image empty' />
							<p>Danh sách lựa chọn rỗng!</p>
						</div>
					)}

					<div className={styles.control}>
						<div>
							<Button p_10_40 rounded_8 blue-outline onClick={handleClose}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<Button disable={listDataTerm?.length == 0} p_10_40 rounded_8 blue onClick={handleSaveData}>
								Xác nhận
							</Button>
						</div>
					</div>

					<div className={styles.close} onClick={handleClose}>
						<IoClose size={24} color='#23262F' />
					</div>
				</div>
			</Popup>
		</Fragment>
	);
}

export default SelectMany;
