//@flow

import * as React from 'react';
import icon from '../styles/components/icon.scss';

export default () => (
	<div className={icon.container} >
		<img className={icon.icon} src="https://image.flaticon.com/icons/svg/185/185983.svg" />
		<div className={icon["pulse-ring"]} />
	</div>
);