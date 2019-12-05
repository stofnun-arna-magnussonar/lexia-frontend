import React, { Component } from 'react';

class StictyWatcher extends Component {
	constructor(props) {
		super(props);

		this.scrollHandler = this.scrollHandler.bind(this);

		this.state = {
			extraClass: ''
		};
	}

	scrollHandler(event) {
		if (this.waitForNextCheck) {
			setTimeout(function() {
				this.scrollHandler(null);
			}.bind(this), 150);

			return;
		}

		if (this.refs.el.getBoundingClientRect().y == 0) {
			this.waitForNextCheck = true;

			this.setState({
				extraClass: this.props.stickyClassName || ''
			});

			if (this.props.onStick) {
				this.props.onStick();
			}

			setTimeout(function() {
				this.waitForNextCheck = false;
			}.bind(this), 400);
		}
		else {
			this.setState({
				extraClass: ''
			});

			if (this.props.onUnstick) {
				this.props.onUnstick();
			}
		}
	}

	componentDidMount() {
		window.addEventListener('scroll', this.scrollHandler);

		this.scrollHandler();
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.scrollHandler);
	}

	render() {
		let TagName = this.props.tagName || 'div';
		return (
			<TagName ref="el" className={this.props.className+' '+this.state.extraClass}>
				{this.props.children}
			</TagName>
		);
	}
}

export default StictyWatcher;
