import React, { Component } from 'react';

class CollapsibleCard extends Component {
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
		return <div className={'card collapsible-card '+(this.props.mobileMenu ? 'mobile-menu ' : '')+(this.props.className || '')+(this.state.open ? ' open' : '')}>
			<button className="btn btn-secondary card-button" onClick={this.toggleOpen}>
				{this.state.open ? '-' : '+'}
			</button>
			{
				this.props.title &&
				<div className="card-header" onClick={this.toggleOpen} dangerouslySetInnerHTML={{__html: this.props.title}} />
			}
			<div className="card-body">
				{this.props.children}
			</div>
		</div>
	}
}

export default CollapsibleCard;