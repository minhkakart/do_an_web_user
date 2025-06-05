import React, {Fragment} from 'react';

import {PropsLoading} from './interfaces';
import styles from './Loading.module.scss';

function Loading({loading}: PropsLoading) {
	return (
		<Fragment>
			{loading && (
				<div className={styles.container}>
					<div className={styles.loadingContent}>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			)}
		</Fragment>
	);
}

export default Loading;
