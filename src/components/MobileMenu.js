import React, { Component } from 'react';

class MobileMenu extends Component {
	constructor(props) {
		super(props);

		this.toggleOpen = this.toggleOpen.bind(this);

		this.state = {
			open: false
		};
	}

	toggleOpen() {
		this.setState({
			open: !this.state.open
		})
	}

	render() {
		return <div className={'card gray narrow-card mobile-menu '+(this.props.className || '')+(this.state.open ? ' open' : '')}>
			<button className="btn btn-secondary menu-button" onClick={this.toggleOpen}>
				<span></span>
			</button>
			{
				this.props.title &&
				<div className="card-header" onClick={this.toggleOpen}>{this.props.title}</div>
			}
			<div className="card-body">
				{this.props.children}
			</div>
		</div>
	}
}

export default MobileMenu;