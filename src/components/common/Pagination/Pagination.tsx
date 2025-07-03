'use client'

import React, {Fragment, useEffect, useMemo, useState} from 'react';

import {PropsPagination} from './interfaces';
import styles from './Pagination.module.scss';
import clsx from 'clsx';
import TippyHeadless from '@tippyjs/react/headless';
import {IoArrowBackOutline, IoArrowForwardOutline} from 'react-icons/io5';
import {MdArrowDropDown} from 'react-icons/md';
import {PageSize} from "~/constants/config";

function Pagination({total, page, pageSize, onSetPage, onSetPageSize, dependencies = []}: PropsPagination) {
	const pageSizes= PageSize;

	const [openLimit, setOpenLimit] = useState<boolean>(false);

	// Render list page
	const items = useMemo(() => {
		const items: React.ReactNode[] = [];
		const max = Math.ceil(total / Number(pageSize));

		for (let i = 1; i <= max; i++) {
			if (i === page - 1 || i === page + 1 || i === page || i === 1 || i === max) {
				items.push(
					<li key={i} className={clsx([styles.item, {[styles.active]: page === i}])} onClick={() => onSetPage(i)}>
						{i}
					</li>
				);
			}

			if ((i === page - 2 && page >= 4) || (i === page + 2 && i < max)) {
				items.push(
					<li key={i} className={clsx([styles.item, {[styles.active]: page === i}])}>
						...
					</li>
				);
			}
		}
		return items;
	}, [total, pageSize, page, onSetPage]);

	const handlePrev = () => {
		if (page > 1) onSetPage(page - 1);
	};

	const handleNext = () => {
		if (page < Math.ceil(total / Number(pageSize))) onSetPage(page + 1);
	};

	useEffect(() => {
		onSetPage(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);

	return (
		<Fragment>
			{total > 0 && (
				<div className={styles.container}>
					<div className={styles.left}>
						<p className={styles.text}>Hiển thị </p>
						<TippyHeadless
							maxWidth={'100%'}
							interactive
							visible={openLimit}
							onClickOutside={() => setOpenLimit(false)}
							placement='bottom-end'
							render={(attrs: any) => (
								<div className={styles.list_limit}>
									{pageSizes.map((v, i) => (
										<div
											key={i}
											className={clsx(styles.item_limit, {
												[styles.activeItemLimit]: pageSize == v,
											})}
											onClick={() => {
												onSetPageSize(v);
												setOpenLimit(false);
											}}
										>
											{v}
										</div>
									))}
								</div>
							)}
						>
							<div
								className={clsx(styles.limit, {
									[styles.activeLimit]: openLimit,
								})}
								onClick={() => setOpenLimit(!openLimit)}
							>
								<span>{pageSize}</span>
								<div className={styles.icon_arrow}>
									<MdArrowDropDown size={20} />
								</div>
							</div>
						</TippyHeadless>
						<p className={styles.text}>
							trong tổng <span style={{fontWeight: '600'}}>{total}</span> kết quả
						</p>
					</div>
					<div className={styles.pages}>
						{page > 1 && (
							<button className={clsx([styles.btn, styles.left])} onClick={handlePrev}>
								<span className={styles.icon}>
									<IoArrowBackOutline />
								</span>
							</button>
						)}
						{items}
						{page < Math.ceil(total / Number(pageSize)) && (
							<button className={clsx([styles.btn, styles.right])} onClick={handleNext}>
								<span className={styles.icon}>
									<IoArrowForwardOutline />
								</span>
							</button>
						)}
					</div>
				</div>
			)}
		</Fragment>
	);
}

export default Pagination;
