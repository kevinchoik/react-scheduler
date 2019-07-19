import React from 'react';
import Modal from 'react-modal';
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
			dates: []
		}
	}

	componentDidMount = () => {
		const dates = [];
		const today = new Date();
		for (let i = 0; i < 5; i++) {
			const date = new Date();
			date.setDate(today.getDate() - today.getDay() + i + 1);
			const dateStr = date.getMonth() + '/' + date.getDate();
			dates.push(dateStr);
		}
		this.setState({ dates });
	};

	isToday = (index) => {
		return (index + 1 === new Date().getDay());
	};

	render() {		
		return (<div className="App">
			<div className='week-container'>
				{this.state.days.map((day, index) => <Day key={day} day={day} date={this.state.dates[index]} today={this.isToday(index)}/>)}
			</div>
		</div>);
	}
}

class Day extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			numCall: 0,
			free: []
		}
	}

	componentDidMount() {
		let free = [];
		for (let i = 0; i < 8; i++) {
			free.push(true);
		}
		this.setState({ free });
	}

	incrCall = (incr, index) => {
		let free = [...this.state.free];
		free[index] = !free[index];
		this.setState({
			numCall: (incr) ? this.state.numCall + 1 : this.state.numCall - 1,
			free
		});
	};

	freeBlock = (hours) => {
		let start = null;
		let end;
		let maxStart;
		let maxEnd;
		let maxBlock = -1;
		for (let i = 0; i < 8; i++) {
			if (this.state.free[i]) {
				if (start === null) {
					start = i;
				}
				end = i;
				const currBlock = end - start;
				if (currBlock > maxBlock) {
					maxStart = start;
					maxEnd = end;
					maxBlock = currBlock;
				}
			} else {
				start = null;
			}
		}
		return `${hours[maxStart]} ~ ${hours[maxEnd]} (${maxBlock + 1} hours)`
	};

	isToday = (today) => {
		return 'day-container' + ((today) ? ' today' : '');
	}

	render() {
		let hours = [];
		for (let i = 0; i < 8; i++) {
			if (i > 3) {
				hours.push((i - 3) + 'pm');
			} else {
				hours.push((i + 9) + 'am');
			}
		}

		return(<div className={this.isToday(this.props.today)}>
			<div className='date-container'>
				<div className='day-title'>{this.props.day}</div>
				<div className='date-title'>{this.props.date}</div>
			</div>
			<div className='app-call'>Number of Calls: {this.state.numCall}</div>
			<div className='app-free'>Longest free block: {this.freeBlock(hours)}</div>
			<div className='schedule-list-container'>
				{hours.map((hour, index) => <TimeSlot key={hour} hour={hour} update={incr => this.incrCall(incr, index)}/>)}
			</div>
		</div>);
	}
}

class TimeSlot extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			number: '',
			isModal: false
		};
		this.nameRef = React.createRef();
		this.numberRef = React.createRef();
	}

	checkInfo = () => {
		return 'schedule-container' + ((this.state.name && this.state.number) ? ' schedule-info': '');
	};

	openModal = () => {
		this.setState({ isModal: true });
	};

	closeModal = () => {
		this.setState({ isModal: false });
	};

	updateSched = () => {
		const beforeState = Boolean(this.state.name && this.state.number);
		const afterState = Boolean(this.nameRef.current.value && this.numberRef.current.value);
		if (!beforeState && afterState) {
			this.props.update(true);
		} else if (beforeState && !afterState) {
			this.props.update(false);
		}

		this.setState({
			name: this.nameRef.current.value,
			number: this.numberRef.current.value,
			isModal: false
		});
	};

	myModal = () => {
		return (<Modal isOpen={this.state.isModal} onRequestClose={this.closeModal} className='modal-container' overlayClassName='overlay'>
			<div className='schedule-title'>{this.props.hour}</div>
			<div className='schedule-form'>
				<div className='schedule-label'>Name:</div>
				<input type='text' defaultValue={this.state.name} ref={this.nameRef}></input>
			</div>
			<div className='schedule-form'>
				<div className='schedule-label'>Phone number:</div>
				<input type='text' defaultValue={this.state.number} ref={this.numberRef}></input>
			</div>
			<div className='modal-btn'>
				<button onClick={this.updateSched}>Update</button>
				<button onClick={this.closeModal}>Cancel</button>
			</div>
		</Modal>);
	};

	showForm = () => {
		return (this.state.name && this.state.number) ? (<div className='schedule-form-wrapper'>
				<div className='schedule-form'>
					<div className='schedule-label'>Name:</div>
					<div>{this.state.name}</div>
				</div>
				<div className='schedule-form'>
					<div className='schedule-label'>Phone number:</div>
					<div>{this.state.number}</div>
				</div>
			</div>) : <div className='schedule-none-text'>Unscheduled</div>;
	};

	render() {
		return(<div className='schedule-row'>
			<div className={this.checkInfo()} onClick={this.openModal}>
				<div className='schedule-title'>{this.props.hour}</div>
				{this.showForm()}
			</div>
			{this.myModal()}
		</div>);
	}
}

export default App;
