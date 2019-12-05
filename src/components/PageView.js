import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";

//import BreadCrumbs from './BreadCrumbs';
import config from './../config';

class PageView extends Component {
	constructor(props) {
		super(props);

		this.url = config.apiRoot+'/api/pages/';

		this.htmlContentClickHandler = this.htmlContentClickHandler.bind(this);
		this.languageChangedHandler = this.languageChangedHandler.bind(this);

		this.state = {
			initialized: false
		};
	}

	componentDidMount() {
		if (this.props.location || this.props.url) {
			this.fetchData();
		}

		window.eventBus.addEventListener('Lang.languageChanged', this.languageChangedHandler);
	}

	componentDidUpdate(prevProps, prevState) {
		// Athuga hvort breytur hafi breyst og hvort component eigi að uppfærast
		if ((this.props.location && this.props.location.pathname != prevProps.location.pathname)) {
			this.setState({
				data: null,
				willRefresh: true
			}, function() {
				this.fetchData();
			}.bind(this));
		}

		if (!this.state.willRefresh && this.refs.htmlContainer) {
			let tables = this.refs.htmlContainer.getElementsByTagName('table');

			for (var i = 0; i < tables.length; i++) {
				tables[i].classList.add('table');
				tables[i].classList.add('table-responsive');
			}
		}
	}

	isExternal(url) {
		var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
		if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== window.location.protocol) return true;
		if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[window.location.protocol]+")?$"), "") !== window.location.host) return true;
		return false;
	}

	scrollToAnchor(anchorName) {
		anchorName = anchorName.substr(1);
	}
	htmlContentClickHandler(event) {
		let linkEl = event.target.closest('a');

		if (linkEl) {
			let linkUrl = linkEl.getAttribute('href');

			if (linkUrl.substr(0, 1) == '#') {
				this.scrollToAnchor(linkUrl);
			}
			else if (!this.isExternal(linkUrl) && (!linkEl.getAttribute('target'))) {
				event.preventDefault();
				this.props.history.push(linkUrl);
			}
		}
	}

	languageChangedHandler() {
		//this.fetchData();
	}

	fetchData() {
		window.scrollTo(0, 0);

		let currentLang = window.currentLang || 'is';

		let path = this.props.url ? this.props.url : this.props.location.pathname;

		let siteLang = path.substr(1, 2);

		// Sæki gögn til APA
		fetch(this.url+'?url='+path+'&site='+config.site+'&lang='+siteLang)
			.then(function(response) {
				return response.json();
			})
			.then(function(json) {
				this.setState({
					data: json.results[0],
					willRefresh: false,
					notFound: json.length == 0
				});

				if (json.results[0] && json.results[0].title) {
					window.document.title = config.siteTitle+' | '+json.results[0].title;
				}

				setTimeout(function() {
					this.setState({
						initialized: true
					});
				}.bind(this), 200);
			}.bind(this));
	}

	formatHtml(html) {
		let formatedHtml = html.replace(/\\r|\\n/g, '');

		return formatedHtml;
	}

	render() {
		let dataItem = this.state.data || null;

		return (
			<div className={'card content-container manual-init'+(this.state.initialized ? ' initialized' : '')}>
				{
					dataItem &&
					
					<div className="page-content card-body">
						{
							/*
							dataItem.path.length > 1 &&
							<BreadCrumbs path={dataItem.path} />
							*/
						}
						<div className="html-content" ref="htmlContainer" onClick={this.htmlContentClickHandler} dangerouslySetInnerHTML={{__html: this.formatHtml(dataItem.content)}}/>
					</div>
				}
				{
					this.state.notFound &&
					<div className="page-content">
						<h2>Síða finnst ekki</h2>
						<p>Engin síða finnst á slóðinni <strong>{this.props.history.location.pathname}</strong>.</p>
					</div>
				}
			</div>
		);
	}
}

export default withRouter(PageView);
