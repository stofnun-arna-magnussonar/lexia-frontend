import React, { Component } from 'react';
import { Link } from "react-router-dom";

import config from './../config';
import islexHelper from './../islexHelper';

import _ from 'underscore';

class TermIndexList extends Component {
	constructor(props) {
		super(props);

		this.url = config.apiRoot+'/api/flettur_list/';

		this.windowResizeHandler = this.windowResizeHandler.bind(this);

		this.state = {
			listData: [],
			fetching: true
		};
	}

	componentDidMount() {
		if (this.props.flid) {
			this.fetchData();
		}

		this.mobileWidth = window.innerWidth < 550;

		window.addEventListener('resize', this.windowResizeHandler);
	}

	componentDidUpdate(prevProps, prevState) {
		// Skoðað hvort breytur hafa breyst og hvort component eigi að uppfærast
		if (
			prevProps.flid != this.props.flid
		) {
			this.fetchData();
		}

		window.removeEventListener('resize', this.windowResizeHandler);
	}

	windowResizeHandler(event) {
		console.log('resize')
		let mobileWidth = window.innerWidth < 550;

		if (mobileWidth != this.mobileWidth) {
			this.mobileWidth = mobileWidth;

			this.forceUpdate();
		}
	}

	fetchData() {
		// Sæki gögn til APA
		this.setState({
			listData: [],
			fetching: true,
		});

		let urlParams = [
			'flid='+this.props.flid
		];

		if (window.innerWidth < 550) {
			urlParams.push('before=1');
			urlParams.push('after=5');
		}

		fetch(this.url+'?'+urlParams.join('&'))
			.then(function(response) {
				return response.json();
			})
			.then(function(json) {
				this.setState({
					listData: json.results,
					fetching: false
				});
			}.bind(this));
	}

	render() {
		let currentLang = window.currentLang || 'is';

		return (
			<React.Fragment>
				{
					this.state.listData.length > 0 &&
					<React.Fragment>
						<ul className="nav nav-pills flex-column">
							{
								this.state.listData.map(function(item, index) {
									return <li key={index} className={'nav-item'}>
										<Link className={'nav-link pt-1 pb-1'+(item.flid == this.props.flid ? ' active' : '')} key={index} to={'/'+currentLang+'/ord/'+item.flid+(this.props.lang ? '/tungumal/'+this.props.lang : '')}>{item.rnum ? item.rnum+' ' : ''}{item.fletta} {islexHelper.formatOfl(item.ofl)}</Link>
									</li>;
								}.bind(this))
							}
						</ul>
					</React.Fragment>
				}
			</React.Fragment>
		);
	}
}

export default TermIndexList;
