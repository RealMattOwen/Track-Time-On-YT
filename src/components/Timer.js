//@flow

import moment from 'moment';
import * as React from 'react';
import timer from '../styles/components/timer.scss';

type TimerState = {
	currentTime: number,
	timerStatus: boolean
};

class Timer extends React.Component<{}, TimerState> {
	state = {
		currentTime: 0,
		timerStatus: true
	};
	componentDidMount() {
		chrome.tabs.query({ active: true, url: 'https://*.youtube.com/watch?v=*' }, result => {
			if (!result.length) {
				this.setState(prevState => ({
					timerStatus: !prevState.timerStatus
				}));
			}
		});
		chrome.runtime.sendMessage({ msg: 'active' }, res => {
			if (res) {
				this.updateCurrentTime();
			}
		});
	};
	updateCurrentTime = () => {
		chrome.storage.sync.get(['currentTime'], result => {
			this.setState({ currentTime: result.currentTime });
		});

		let key = 'currentTime';
		chrome.storage.onChanged.addListener(changes => {
			for (key in changes) {
				let storageChange = changes[key];

				if (storageChange.oldValue !== storageChange.newValue) {
					this.setState({ currentTime: storageChange.newValue });
				}
			}
		});
	};
	formSentence = () => {
		const currentTime = moment(this.state.currentTime);
		const hours = parseInt(currentTime.format('h')) - 1;
		const minutes = currentTime.format('m');
		const seconds = currentTime.format('s');

		if (hours) {
			return (
				<time>
					<span className={timer.numbers}>{hours}</span> hour{hours.toString() !== '1' ? 's' : ''} and <span className={timer.numbers}>{minutes}</span> minute{minutes.toString() !== '1' ? 's' : ''}
				</time>
			);
		} else {
			return (
				<time>
					<span className={timer.numbers}>{minutes}</span> minute{minutes.toString() !== '1' ? 's' : ''} and <span className={timer.numbers}>{seconds}</span> second{seconds.toString() !== '1' ? 's' : ''}
				</time>
			);
		}
	};
	render() {
		return (
			<div className={timer.container}>
				{this.formSentence()}
			</div>
		);
	};
}

export default Timer;