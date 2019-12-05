import React, { Component } from 'react';
import { Link } from "react-router-dom";

import config from './../config';
import islexHelper from './../islexHelper';

class OrdVikunnar extends Component {
	constructor(props) {
		super(props);

		this.url = config.apiRoot+'/api/vikuord/';

		this.state = {
			data: []
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		this.setState({
			data: []
		});

		// Sæki gögn til APA

		fetch(this.url)
			.then(function(response) {
				if (!response.ok) {
					this.setState({
						found: false
					})

					return false;
				}
				else {
					return response.json();
				}
			}.bind(this))
			.then(function(json) {
				if (json) {
					this.setState({
						found: true,
						data: json.results[0]
					})
				}
			}.bind(this));
	}

	render() {
		let currentLang = window.currentLang || 'is';

		if (this.state.data) {
			return (
				<div className="mt-4">
					<h3>{window.l('Orð vikunnar')}</h3>
					<p><Link to={'/'+currentLang+'/ord/'+this.state.data.flid+'/tungumal/'+(localStorage.getItem('selected-lang') || 'FRA')}>{this.state.data.fletta} <small>{islexHelper.formatOfl(this.state.data.ofl)}</small></Link></p>
				</div>
			);
		}
		else {
			return null;
		}
	}
}

export default OrdVikunnar;