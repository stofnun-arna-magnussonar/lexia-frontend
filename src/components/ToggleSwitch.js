import React, { Component } from 'react';
import { Link } from "react-router-dom";

class ToggleSwitch extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={'toggle-switch '+(this.props.value ? 'switch-on' : 'switch-off')} onClick={function() {
				if (this.props.onChange) {
					this.props.onChange({
						target: {
							type: 'checkbox',
							name: this.props.name || '',
							checked: !this.props.value
						}
					});
				}
			}.bind(this)}>
				{
					this.props.label &&
					<div className="label">{this.props.label}</div>
				}

				<div className="switch">
					<div className="button"><span className="icon" /></div>
				</div>
			</div>
		);
	}
}

export default ToggleSwitch;
