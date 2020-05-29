import React, { Component } from 'react';
import { Link } from "react-router-dom";
import _ from 'underscore';

import TermView from './TermView';
import CollapsibleCard from './CollapsibleCard';
import TermIndexList from './TermIndexList';
import SimilarTerms from './SimilarTerms';

import config from './../config';
import islexHelper from './../islexHelper';

class TermViewContainer extends Component {
	constructor(props) {
		super(props);

		this.url = config.apiRoot+'/api/es/fletta/';

		this.state = {
			found: true
		};
	}

	listToTree(list) {
		let map = {};
		let item;
		let roots = [];

		let i;
		for (i = 0; i < list.length; i += 1) {
			map[list[i].itid] = i; // initialize the map
			list[i].pitems = []; // initialize the children
		}

		for (i = 0; i < list.length; i += 1) {
			item = list[i];
			if (item.paritem != -1) {
				// if you have dangling branches check that map[item.paritem] exists
				if (list[map[item.paritem]]) {
					list[map[item.paritem]].pitems.push(item);
				}
			} else {
				roots.push(item);
			}
		}

		return roots;
	}

	formatResults(data) {
		return this.listToTree(data);
	}

	componentDidMount() {
		if (this.props.match && this.props.match.params.entry_id) {
			this.fetchData();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// Athuga hvort breytur hafi breyst og hvort component eigi að uppfærast

		if (this.props.match && this.props.match.params.entry_id &&
			(
				prevProps.match.params.entry_id != this.props.match.params.entry_id ||
				this.props.match.params.lang != prevProps.match.params.lang
			)
		) {
			this.fetchData();
		}
	}

	fetchData(missingTranslation) {
		// Sæki gögn til APA

		fetch(this.url+this.props.match.params.entry_id+(this.props.match.params.lang && !missingTranslation ? '?lang='+this.props.match.params.lang : ''))
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
					let dataItem = json;

					if (dataItem.items) {
						if (!missingTranslation && this.props.match.params.lang && !_.find(dataItem.items, function(item) {
							return item.teg.toLowerCase().startsWith(this.props.match.params.lang.toLowerCase()) || item.teg.toLowerCase().endsWith(this.props.match.params.lang.toLowerCase());
						}.bind(this))) {
							this.fetchData(true);
						}

						if (missingTranslation) {
							dataItem.missingTranslation = true;
						}

						dataItem.items = this.formatResults(dataItem.items);
					}

					this.setState({
						found: true,
						data: dataItem
					})
				}
			}.bind(this));

		window.scrollTo(0, 0);
	}

	render() {
		let dataItem = this.state.data;

		let currentLang = window.currentLang || 'is';

		if (!this.state.found) {
			return (
				<div className="row mt-4">
					<div className="col-12 col-sm-5 col-md-3">

					</div>

					<div className="col-12 col-sm-7 col-md-9">
						<ul className="list-group mb-4 dictionary-list">
							<li className="list-group-item text-center">
								<div className="h5 mt-3 mb-4">Þessi færsla finnst ekki.</div>
							</li>
						</ul>
					</div>
				</div>
			);
		}
		else if (dataItem) {
			let langButtons = [];

			for (let lang in islexHelper.tungumal) {
				langButtons.push(<span key={lang} className="nav-item">
					<Link className={'nav-link'+(this.props.match.params.lang && this.props.match.params.lang == lang ? ' active' : '')}
						to={'/'+currentLang+'/ord/'+this.props.match.params.entry_id+'/tungumal/'+lang}
						onClick={
							function() {
								localStorage.setItem('selected-lang', lang);
							}
						}>
						<img className="button-flag" src={'img/flags/'+lang+'.png'} />

						<span> {islexHelper.tungumal[lang].name}</span>
					</Link>
				</span>);
			}

			langButtons.push(<span key="all" className="nav-item">
				<Link className={'nav-link'+(!this.props.match.params.lang || this.props.match.params.lang == '' ? ' active' : '')}
					to={'/'+currentLang+'/ord/'+this.props.match.params.entry_id}>
					{window.l('Allar')}
				</Link>
			</span>);

			// adj n adv v

			return (
				<div className="row mt-4">

					<div className="col-12 col-sm-7 col-md-9 d-flex flex-column">
						{
							this.state.data &&
							<React.Fragment>

								{/*

								Takkar til að skipta á milli orðabóka

								<div className="nav nav-pills">
									<div className="navbar-text text-secondary mr-4 mb-2 d-none d-sm-block">{window.l('Orðabók')}: </div>
									{
										langButtons
									}
								</div>
								*/}

								<div className={'dictionary-entry card flex-grow-1'}>
									<div className={'card-body'}>

										<TermView data={dataItem} lang={this.props.match.params.lang} />

										{
											['adj', 'n', 'adv', 'v', 'forl'].indexOf(dataItem.ofl.split(' ')[0]) > -1 &&
											<SimilarTerms flid={this.props.match.params.entry_id} />
										}

									</div>

								</div>
							</React.Fragment>
						}
					</div>

					<div className="col-12 col-sm-5 col-md-3">
						<div className="index-column">

							{/*<Link className="btn btn-info btn-block mb-2" to="/">&lt; {window.l('Til baka á forsíðu')}</Link>*/}

							<TermIndexList flid={this.props.match.params.entry_id} lang={this.props.match.params.lang} />

						</div>

					</div>

				</div>
			);
		}
		else {
			return null;
		}
	}
}

export default TermViewContainer;
