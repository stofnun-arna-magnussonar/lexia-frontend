import React, { Component } from 'react';
import { Link } from "react-router-dom";

import config from './../config';
import islexHelper from './../islexHelper';

import _ from 'underscore';

class SimilarTerms extends Component {
	constructor(props) {
		super(props);

		this.url = config.apiRoot+'/api/es/similar/';

		this.fetchDelay = 100;

		this.state = {
			listData: []
		};
	}

	componentDidMount() {
		this.mounted = true;

		setTimeout(function() {
			if (this.mounted) {
				this.fetchData();
			}
		}.bind(this), this.fetchDelay);
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	componentDidUpdate(prevProps, prevState) {
		// Skoðað hvort breytur hafa breyst og hvort component eigi að uppfærast
		if (
			prevProps.flid != this.props.flid
		) {
			this.setState({
				listData: []
			});

			setTimeout(function() {
				if (this.mounted) {
					this.fetchData();
				}
			}.bind(this), this.fetchDelay);
		}
	}

	fetchData() {
		if (this.fetching) {
			return;
		}

		this.fetching = true;

		fetch(this.url+this.props.flid)
			.then(function(response) {
				return response.json();
			})
			.then(function(json) {
				this.fetching = false;

				this.setState({
					listData: json.results
				});
			}.bind(this));
	}

	render() {
		let currentLang = window.currentLang || 'is';

		return (
			<div className={'mt-4 mb-4 fade-in-component'+(this.state.listData.length == 0 ? ' hidden' : '')}>
				<hr/>
				<strong className="mr-2">{window.l('Skyldar færslur')}:</strong>
				{
					this.state.listData.map(function(item, index) {
						return <Link key={index} className="nav-link d-inline-block pl-0 pb-1" to={'/'+currentLang+'/ord/'+item.flid+'/tungumal/'+(localStorage.getItem('selected-lang') || 'FRA')}>
								{item.fletta} {islexHelper.formatOfl(item.ofl)}</Link>
					})
				}
				<div className="dict-info alert alert-info">{window.l('Færslurnar eru nokkurs konar samheiti sem fengin eru með reiknireglum með jafnheitum markmálanna.')}</div>
			</div>
		);
	}
}

export default SimilarTerms;
