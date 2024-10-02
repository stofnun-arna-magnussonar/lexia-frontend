import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";

import SearchBox from './components/SearchBox';
import Frontpage from './components/Frontpage';
import SearchResultsList from './components/SearchResultsList';

import LangMenu from './components/LangMenu';
import PageMenu from './components/PageMenu';
import TermViewContainer from './components/TermViewContainer';
import StickyWatcher from './components/StickyWatcher';
import SiteFooter from './components/SiteFooter';
import PageView from './components/PageView';
import ContactFormWrapper from './components/ContactFormWrapper';
import GoogleAnalytics from './components/GoogleAnalytics';

import EventBus from 'eventbusjs';

import config from "./config";
import islexHelper from "./islexHelper";

import logo from './img/logo-single.png';
import logoVigdisIs from './img/logo-vigdis-white-is.png';
import logoVigdisFr from './img/logo-vigdis-white-fr.png';
import logoVinarborg from './img/logo-vinarborg.png';

window.islexHelper = islexHelper;

class App extends Component {
	constructor(props) {
		super(props);

		window.eventBus = EventBus;

		this.menuButtonClickHandler = this.menuButtonClickHandler.bind(this);
		this.languageChangedHandler = this.languageChangedHandler.bind(this);

		this.fetchOflTranslations();

		this.state = {
			searchParams: {},
			menuOpen: false
		};
	}

	componentDidMount() {
		this.refs.router.history.listen(function() {
			this.checkCurrentLang();

			this.setState({
				menuOpen: false
			});
		}.bind(this));

		this.checkCurrentLang();

		document.addEventListener('mousedown', function(event) {
			if (!this.state.menuOpen) {
				return;
			}

			if (this.refs.menuButton.contains(event.target)) {
				event.stopPropagation();

				return;
			}

			if (this.refs.menuContent && !this.refs.menuContent.contains(event.target)) {
				this.setState({
					menuOpen: false
				})
			}
		}.bind(this));

		window.eventBus.addEventListener('Lang.languageChanged', this.languageChangedHandler);
		window.eventBus.addEventListener('Lang.languageDataUpdate', function() {
			this.forceUpdate();
		}.bind(this));
		window.eventBus.addEventListener('AppMenu.close', function() {
			this.setState({
				menuOpen: false
			});
		}.bind(this));
	}

	checkCurrentLang() {
		if (!this.refs.router) {
			return;
		}

		let lang = this.refs.router.history.location.pathname.substr(1, 2);

		window.Lang.setCurrentLang(lang)
	}

	fetchOflTranslations() {
		window.islexData = {};

		// Sæki nöfn og kóða allra tungumála
		fetch(config.apiRoot+'/api/ofltrans?limit=1000')
			.then(function(response) {
				return response.json();
			})
			.then(function(json) {
				window.islexData['oflTrans'] = json.results;

				this.setState({
					oflTrans: json.results
				})
			}.bind(this));
	}

	languageChangedHandler() {
		this.forceUpdate();

		return
		let path = this.refs.router.history.location.pathname.toLowerCase();
		if (path.substr(0, 5) != '/ord/' && path.substr(0, 6) != '/leit/') {
			this.refs.router.history.push('/');
		}
	}

	menuButtonClickHandler(event) {
		event.stopPropagation();
		if (!this.state.menuOpen) {
			this.refs.menuContent.scrollTop = 0;
		}

		this.setState({
			menuOpen: !this.state.menuOpen
		});
	}

	render() {
		let currentLang = window.currentLang || 'is';

		let currentLangIcon = <img className="current-lang-icon" src={'/img/flags/'+currentLang.toUpperCase()+'.png'} />;

		let langCodes = [];

		islexHelper.langCodes.forEach(function(langCode) {
			langCodes.push(langCode);
		});

		let routes = [
			<Route key={0} path={'/'} exact={true}>
				<Redirect to="/is/" />
			</Route>,
			<Route key={1} path={'/islex'} exact={true}>
				<Redirect to="/is/" />
			</Route>
		];

		langCodes.forEach(function(langCode) {
			routes.push(<Route key={routes.length} path={'/'+langCode+'/'} component={Frontpage} exact={true} />);
			routes.push(<Route key={routes.length} exact strict path={'(/'+langCode+'/leit/)?:searchString*(/fletta/)?:fletta*(/ofl/)?:ofl*(/rnum/)?:rnum*(/leitarsvid/)?:leitarsvid*(/page/)?:page*'} render={(routeProps) => (
				<SearchResultsList onSearch={searchParams => this.setState({searchParams: searchParams})} {...routeProps} />
			)} />);
			routes.push(<Route key={routes.length} exact strict path={'(/'+langCode+'/ord/)?:entry_id*(/tungumal/)?:lang*'} render={(routeProps) => (
				<React.Fragment>
					<TermViewContainer {...routeProps} />
				</React.Fragment>
			)} />);
			routes.push(<Route key={routes.length} exact path={'/'+langCode+'/hafa-samband'} render={(routeProps) => (
				<ContactFormWrapper />
			)} />);
		}.bind(this))
		routes.push(<Route key={routes.length} exact path={'/*'} render={(routeProps) => (
			<PageView />
		)} />);


		return (
			<Router ref="router">
				<React.Fragment>

					<div className={'app-wrapper'}>

						<div className="header">

							<div className="container">

								<div className="logo-wrapper">
									<div className="logo">
										<img src={logo} className="mr-4" />
									</div>
									
									<div className="text">
										{
											currentLang == 'fr' &&
											<div><small>{window.l('Le dictionnaire')}</small> {window.l('LEXIA')}</div>
										}
										{
											currentLang == 'is' &&
											<div>{window.l('LEXIA')}<small>{window.l('-orðabókin')}</small></div>
										}
										{
											currentLang == 'de' &&
											<div>{window.l('LEXIA')}<small>{window.l('-orðabókin')}</small></div>
										}
									</div>

								</div>

								<a href="https://vigdis.hi.is/" className="logo-vigdis">
									{
										currentLang == 'fr' &&
										<img src={logoVigdisFr} />
									}
									{
										currentLang == 'is' &&
										<img src={logoVigdisIs} />
									}
									{
										currentLang == 'de' &&
										<img src={logoVigdisIs} />
									}
								</a>

								<a href="https://www.univie.ac.at/" className="logo-vinarborg">
									<img src={logoVinarborg} />
								</a>

								<PageMenu className="hidden-mobile" lang={currentLang} />

							</div>

						</div>

						<StickyWatcher tagName="div" className="search-container" stickyClassName="sticky">

							<div className="container">
								<button className="btn-menu" ref="menuButton" onClick={this.menuButtonClickHandler}>
									<div className="hamburger-icon black">
										<div className="icon-middle" />
										<div className="icon-before-after" />
									</div>

									{
										currentLangIcon
									}

								</button>

								<SearchBox searchString={this.state.searchParams.searchString || ''} />

							</div>

						</StickyWatcher>

						<div className="container pb-4">

							<Switch>
								{
									routes
								}
							</Switch>

						</div>

					</div>

					<SiteFooter />

					<div className={'app-menu'+(this.state.menuOpen ? ' open' : '')} ref="menuContent">
						<div className="container">

							<button className="btn btn-link float-right" onClick={
								function() {
									this.setState({
										menuOpen: false
									});
								}.bind(this)}>
								<div className="hamburger-icon black open">
									<div className="icon-middle" />
									<div className="icon-before-after" />
								</div>
							</button>

							<h5 className="mb-4 pt-2">
								{
									currentLang == 'fr' &&
									<span>{window.l('Le dictionnaire')} {window.l('LEXIA')}</span>
								}
								{
									currentLang == 'is' &&
									<span>{window.l('LEXIA')}{window.l('-orðabókin')}</span>
								}
							</h5>

							<PageMenu className="hidden-mobile-up" lang={currentLang} />

							<h6>{window.l('Tungumál')}</h6>
							<LangMenu />

						</div>
					</div>
					{
						/*
					<GoogleAnalytics />
						*/
					}

				</React.Fragment>
			</Router>
		);
	}
}

export default App;
