class Timer {
	clock = 0;
	dateCheck = () => {
		const now = new Date();
		const currentDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

		chrome.storage.sync.get(['currentDate'], result => {
			if (result.currentDate !== currentDate) {
				this.reset(currentDate);
			} else {
				chrome.storage.sync.set({ currentTime: timerInstance.clock });
			}
		});
	};
	delta = () => {
		let now = Date.now(),
			d   = now - this.offset;

		this.offset = now;
		return d;
	};
	init = () => {
		chrome.storage.sync.get(['currentDate','currentTime'], result => {
			const now = new Date();
			const currentDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

			if (result.currentDate !== currentDate) {
				this.reset(currentDate);
			} else {
				this.clock = result.currentTime;
			}
		});
	};
	popupStatus = 'inactive';
	reset = (currentDate) => {
		this.clock = 0;
		chrome.storage.sync.set({ currentDate, currentTime: timerInstance.clock });
	};
	start = () => {
		if (!this.interval) {
			this.offset = Date.now();
			this.interval = setInterval(this.update, 1000);
		}
	};
	stop = () => {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	};
	update = () => {
		this.clock += this.delta();
		if (this.popupStatus === 'active') {
			this.dateCheck();
		}
	};
}

const timerInstance = new Timer();
timerInstance.init();

chrome.runtime.onMessage.addListener(({ msg }, sender, sendResponse) => {
	sendResponse('Message received');
	if (msg === 'active') {
		timerInstance.popupStatus = 'active';
		timerInstance.dateCheck();
	} else if (msg === 'inactive') {
		timerInstance.popupStatus = 'inactive';
	}
});

chrome.tabs.onActivated.addListener(() => {
	chrome.tabs.query({ active: true, url: 'https://*.youtube.com/watch?v=*' }, result => {
		if (result.length) timerInstance.start(); else timerInstance.stop();
	});
});

chrome.tabs.onUpdated.addListener(() => {
	chrome.tabs.query({ active: true, url: 'https://www.youtube.com/watch?v=*' }, result => {
		if (result.length) timerInstance.start(); else timerInstance.stop();
	});
});

chrome.tabs.onRemoved.addListener(() => {
	chrome.storage.sync.set({ currentTime: timerInstance.clock });
});