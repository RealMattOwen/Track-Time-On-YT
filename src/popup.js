//@flow

import * as React from 'react';
import ReactDOM from 'react-dom';
import Icon from './components/Icon';
import Timer from './components/Timer';
import popup from './styles/components/popup.scss';

class Popup extends React.Component<{}> {
	componentDidMount() {
		window.addEventListener('blur', () => {
			chrome.runtime.sendMessage({ msg: 'inactive' });
		});
	};
	render() {
		return (
			<div className={popup.container} >
				<Icon />
				<Timer />
			</div>
		);
	};
}

const app = document && document.getElementById('app');

if (app) ReactDOM.render(<Popup />, app);