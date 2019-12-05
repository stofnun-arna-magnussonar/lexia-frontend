import React, { Component } from 'react';
import { Link } from "react-router-dom";

import config from './../config';
import TermView from './TermView';
import SearchResultsItem from './SearchResultsItem';
import CollapsibleCard from './CollapsibleCard';
import SearchSuggestion from './SearchSuggestion';

import _ from 'underscore';

class SearchResultsList extends Component {
	constructor(props) {
		super(props);

		this.url = config.apiRoot+'/api/es/flettur/';

		this.state = {
			listData: []
		};
	}

	componentDidMount() {
		this.fetchData();

		window.reactHistory = this.props.history
	}

	componentDidUpdate(prevProps, prevState) {
		// Skoðað hvort breytur hafa breyst og hvort component eigi að uppfærast
		if (
			prevProps.match.params.searchString != this.props.match.params.searchString ||
			prevProps.match.params.ordabok != this.props.match.params.ordabok ||
			prevProps.match.params.order != this.props.match.params.order ||
			prevProps.match.params.page != this.props.match.params.page
		) {
			this.fetchData();
		}
	}

	fetchData() {
		if (this.fetching) {
			return;
		}

		this.fetching = true;

		// Sæki gögn til APA
		let urlParams = [
			'simple=true',
			'showQuery=true'
		];
		if (this.props.match.params.searchString) {
			urlParams.push('leit='+(this.props.match.params.searchString.split('_').join('?')));
		}
		if (this.props.match.params.fletta) {
			urlParams.push('fletta='+(this.props.match.params.fletta.split('_').join('?')));
		}
		if (this.props.match.params.ofl) {
			urlParams.push('ofl='+this.props.match.params.ofl);
		}
		if (this.props.match.params.ordabok) {
			urlParams.push('ordabok='+this.props.match.params.ordabok || '');
		}
		if (this.props.match.params.page) {
			urlParams.push('offset='+((this.props.match.params.page-1)*config.pageSize) || '');
		}

		fetch(this.url+'?'+urlParams.join('&'))
			.then(function(response) {
				return response.json();
			})
			.then(function(json) {
				let currentLang = window.currentLang || 'is';

				this.fetching = false;
				console.log(this)
				if (json.results.length == 1 || this.props.location.search == '?synafyrstu') {
					let selectedLang = localStorage.getItem('selected-lang') || 'FRA';

					this.props.history.replace('/'+currentLang+'/ord/'+json.results[0].flid+'/tungumal/'+selectedLang);
				}
				else if (json.results.length == 0) {
					this.setState({
						listData: json.results,
						found: false,
						searchString: this.props.match.params.searchString,
						ordabok: this.props.match.params.ordabok

					})
				}
				else {
					this.setState({
						listData: json.results,
						total: json.metadata.total,
						found: true,
						searchString: this.props.match.params.searchString,
						ordabok: this.props.match.params.ordabok

					})
				}
			}.bind(this));

		if (this.props.onSearch) {
			this.props.onSearch(this.props.match.params);
		}
	}

	render() {
		let currentLang = window.currentLang || 'is';

		let paginationUrl = '/'+currentLang+'/leit/'+(this.props.match.params.searchString || '')+(this.props.match.params.ordabok ? '/ordabok/'+this.props.match.params.ordabok : '')+
			(this.props.match.params.order ? '/order/'+this.props.match.params.order : '');

		let currentPage = this.props.match.params.page || 1;

		let paginationLinks;


		if (
			((this.props.match.params.page*config.pageSize)-config.pageSize < this.state.total && currentPage > 1) ||
			(currentPage*config.pageSize < this.state.total)
		) {
			paginationLinks = <React.Fragment>
				{
					(currentPage*config.pageSize)-config.pageSize < this.state.total && this.props.match.params.page > 1 &&
					<div className="d-inline-block page-itemr">
						<Link className="page-link" to={paginationUrl+(this.props.match.params.page ? '/page/'+(parseInt(this.props.match.params.page)-1) : '')} aria-label="Previous">
							<span aria-hidden="true">&laquo; {window.l('Fyrri síða')}</span>
							<span className="sr-only">{window.l('Fyrri síða')}</span>
						</Link>
					</div>
				}
				{
					(currentPage*config.pageSize < this.state.total) &&
					<div className="d-inline-block page-item">
						<Link className="page-link" to={paginationUrl+(this.props.match.params.page ? '/page/'+(parseInt(this.props.match.params.page)+1) : '/page/2')} aria-label="Next">
							<span aria-hidden="true">{window.l('Næsta síða')} &raquo;</span>
							<span className="sr-only">{window.l('Næsta síða')}</span>
						</Link>
					</div>
				}
			</React.Fragment>;
		}

		return (
			<div className="row">

				<div className="col-12 col-md-8 offset-md-2">

					{
						this.props.match.params.searchString &&
						<ol className="breadcrumb"><li className="breadcrumb-item active" aria-current="page">{window.l('Leitarniðurstöður fyrir')} <strong>{this.props.match.params.searchString}</strong></li></ol>
					}

					<ul className={'list-group mb-4 dictionary-list'}>
						{
							this.state.listData.length > 0 ?
							this.state.listData.map(function(item, index) {
								return <li key={index} className="list-group-item dictionary-entry">
									<SearchResultsItem order={this.props.match.params.order} data={item} />
								</li>;
							}.bind(this)) :
								!this.state.found &&
								<li key="-1" className="list-group-item text-center">
									<div className="h5 mt-3 mb-4">{this.props.match.params.searchString ? window.l('Engar leitarniðurstöður fyrir')+' \''+this.props.match.params.searchString+'\'' : window.l('Ekkert fannst')}</div>
									<SearchSuggestion searchString={this.props.match.params.searchString} />
								</li>
						}
					</ul>
				</div>

				<div className="col-12 col-sm-5 col-md-3">

					{
						paginationLinks &&
						<div className="index-pagination">
							<div className="d-inline-block">
								{paginationLinks}
							</div>
						</div>
					}

				</div>

			</div>
		);
	}
}

export default SearchResultsList;
