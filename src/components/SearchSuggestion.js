import React, { Component } from 'react';
import { Link } from "react-router-dom";

import _ from 'underscore';

import config from './../config';

class SearchSuggestion extends Component {
	constructor(props) {
		super(props);

		this.url = config.apiRoot+'/api/ordatillaga/';

		this.state = {
			data: []
		};
	}

	componentDidMount() {
		if (this.props.searchString) {
			this.fetchData();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			this.props.searchString != prevProps.searchString
		) {
			this.fetchData();
		}
	}

	fetchData() {
		fetch(this.url+'?fletta='+this.props.searchString)
			.then(function(response) {
				return response.json();
			})
			.then(function(json) {
				this.setState({
					data: _.uniq(json.results, function(item) {
						return item.fletta;
					}),
					fetching: false
				})
			}.bind(this));
	}

	render() {
		let currentLang = window.currentLang || 'is';

		return (
			this.state.data && this.state.data.length > 0 ?
			<React.Fragment>
				<hr className="mb-2" />

				<div className="mt-4 mb-2"><React.Fragment>{window.l('Áttir þú við')} </React.Fragment>
				{
					this.state.data.length == 1 &&
					<strong><Link to={'/'+currentLang+'/leit/'+this.state.data[0].fletta}>{this.state.data[0].fletta}</Link></strong>
				}
				{
					this.state.data.length > 1 &&
					this.state.data.map(function(suggestion, index) {
						return <React.Fragment key={index}>
							<strong>
								<Link to={'/'+currentLang+'/leit/'+suggestion.fletta}>{suggestion.fletta.toLowerCase()}</Link>
							</strong>
							{
								this.state.data.length == 2 && index == 0 &&
								<React.Fragment> {window.l('eða')} </React.Fragment>
							}
							{
								this.state.data.length > 2 && index == this.state.data.length-2 &&
								<React.Fragment> {window.l('eða')} </React.Fragment>
							}
							{
								this.state.data.length > 2 && index < this.state.data.length-2 &&
								<React.Fragment>, </React.Fragment>
							}
						</React.Fragment>
					}.bind(this))
				}
				?</div>

			</React.Fragment>
			: null
		);
	}
}

export default SearchSuggestion;
