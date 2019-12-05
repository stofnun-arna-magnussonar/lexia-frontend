import React, { Component } from 'react';
import { NavLink, Link, withRouter } from "react-router-dom";

import config from './../config';

class PageMenu extends Component {
	constructor(props) {
		super(props);

		this.url = config.apiRoot+'/api/pages/';

		this.state = {
			listData: []
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.lang && prevProps.lang != this.props.lang) {
			this.fetchData();
		}
	}

	fetchData() {
		// Sæki gögn til APA
		this.setState({
			listData: []
		});

		fetch(this.url+'?site='+config.site+'&lang='+(this.props.lang || 'is'))
			.then(function(response) {
				return response.json();
			})
			.then(function(json) {
				this.setState({
					listData: json.results
				});
			}.bind(this));
	}

	render() {
		return (

			<React.Fragment>
				<div className={'menu-links'+(this.props.className ? ' '+this.props.className : '')}>
					{
						this.state.listData.length > 0 &&
						this.state.listData.map(function(item, index) {
							return <NavLink  key={index}exact to={item.url}>{item.title}</NavLink>;
						}.bind(this))
					}

				</div>
			</React.Fragment>
		);
	}
}

export default withRouter(PageMenu);
