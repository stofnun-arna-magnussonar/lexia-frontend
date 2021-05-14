import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import AutocompleteInput from './AutocompleteInput';
import ToggleSwitch from './ToggleSwitch';
import _ from 'underscore';

import config from "./../config";
import islexHelper from "./../islexHelper";

class SearchBox extends Component {
	constructor(props) {
		super(props);

		this.inputKeyPressHandler = this.inputKeyPressHandler.bind(this);
		this.inputChangeHandler = this.inputChangeHandler.bind(this);
		this.executeSearch = this.executeSearch.bind(this);
		this.formatAutocompleteListItems = this.formatAutocompleteListItems.bind(this);
		this.searchBoxItemSelectHandler = this.searchBoxItemSelectHandler.bind(this);
		this.inputFocusHandler = this.inputFocusHandler.bind(this);
		this.documentKeyDownHandler = this.documentKeyDownHandler.bind(this);

		this.state = {
			searchBoxInput: '',
			textaleitInput: false
		};
	}

	inputKeyPressHandler(event) {
		if (event.key == 'Enter') {
			this.executeSearch();
		}
	}

	inputChangeHandler(event) {
		let value = event.target.type && event.target.type == 'checkbox' ? event.target.checked : event.target.value;

		var stateObj = {};

		stateObj[event.target.name] = value;

		this.setState(stateObj);
	}

	componentDidMount() {
		if (this.props.searchString) {
			this.setState({
				searchBoxInput: this.props.searchString
			});
		}

		this.refs.searchInput.refs.inputField.focus();

		setTimeout(function() {
			this.inputFocusHandler();
		}.bind(this), 100);

		//document.addEventListener('keydown', this.documentKeyDownHandler);
	}

	componentWillUnmount() {
		//document.removeEventListener('keydown', this.documentKeyDownHandler);
	}

	componentDidUpdate(prevProps, prevState) {
		let stateObj = this.state;
		let stateChanged = false;

		if (this.props.searchString != prevProps.searchString) {
			stateObj.searchBoxInput = this.props.searchString;
			stateChanged = true;
		}

		if (this.props.leitarsvid != prevProps.leitarsvid) {
			stateObj.textaleitInput = this.props.leitarsvid == 'texti';
			stateChanged = true;
		}

		if (stateChanged) {
			this.setState(stateObj);
		}
	}

	documentKeyDownHandler(event) {
		var isChar = (event.keyCode > 47 && event.keyCode < 58)   || // number keys
			event.keyCode == 32 || event.keyCode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
			(event.keyCode > 64 && event.keyCode < 91)   || // letter keys
			(event.keyCode > 95 && event.keyCode < 112)  || // numpad keys
			(event.keyCode > 185 && event.keyCode < 193) || // ;=,-./` (in order)
			(event.keyCode > 218 && event.keyCode < 223);

		if (document.activeElement != this.refs.searchInput.refs.inputField && isChar) {
			this.setState({
				searchBoxInput: event.key
			});
			this.refs.searchInput.refs.inputField.focus();
		}
	}

	searchBoxItemSelectHandler(item) {
		let selectedLang = localStorage.getItem('selected-lang') || 'FRA';
		let currentLang = window.currentLang || 'is';

		this.props.history.push('/'+currentLang+'/ord/'+item.flid+'/tungumal/'+selectedLang);
	}

	inputFocusHandler() {
		this.refs.searchInput.refs.inputField.select();
	}

	executeSearch() {
		let currentLang = window.currentLang || 'is';
		this.props.history.push('/'+currentLang+'/leit/'+this.state.searchBoxInput+(this.state.textaleitInput ? '/leitarsvid/texti' : ''));
		this.refs.searchInput.refs.inputField.select();
	}

	formatAutocompleteListItems(item) {
		let currentLang = window.currentLang || 'is';
		// Birting á orðabókarfærslum í sprettiniðurstöðum
		let wordEls = [];

		let merking = _.pluck(_.where(item.items, {teg: 'Z-MERKING'}), 'texti');

		return  <div className="pt-2 pb-2">
				<Link to={'/'+currentLang+'/ord/'+item.flid}><strong>{item.fletta}</strong></Link> {islexHelper.formatOfl(item.ofl)}

				{
					merking.length > 0 &&
					<div className="mt-2">
						{
							merking.map(function(merking, index) {
								return <React.Fragment>
									<strong>{index+1}</strong>: {merking}
									{
										index < merking.length-1 &&
										<span>, </span>
									}
								</React.Fragment>
							})
						}
					</div>
				}
		</div>;
	}

	_formatAutocompleteListItems(item) {
		// Birting á orðabókarfærslum í sprettiniðurstöðum
		var wordEls = [];

		return  <div className="pt-2 pb-2 flex-column">
			<span className="mt-3 d-flex w-100 justify-content-between">
				<span><strong>{item.fklanguage.toLowerCase()}</strong>: {item.word}</span>
				<span className="text-right"><em>{window.ordabankiData.dictionaries && window.ordabankiData.dictionaries[item.fkdictionary] ? window.ordabankiData.dictionaries[item.fkdictionary] : item.fkdictionary}</em></span>
			</span>
		</div>;

		if (item.words.length > 0) {
			try {
				wordEls = item.words.map(function(word, index) {
					// Sérstök merking á orði sem passar við það sem verið er að leita að
					let wordEl = word.word.toLowerCase().indexOf(this.state.searchBoxInput.toLowerCase()) > -1 ? <React.Fragment key={index}><mark><strong>{word.fklanguage.toLowerCase()}</strong>: <u>{word.word}</u></mark> </React.Fragment> : <React.Fragment key={index}><strong>{word.fklanguage.toLowerCase()}</strong>: {word.word} </React.Fragment>;
					return wordEl;
				}.bind(this));
			}
			catch (e) {}
		}

		return <div className="pt-2 pb-2 flex-column">
			{
				wordEls.length > 0 &&
				<span className="mt-3 d-flex w-100 justify-content-between"><span>{wordEls}</span> <span className="text-right"><em>{window.ordabankiData.dictionaries && window.ordabankiData.dictionaries[item.fkdictionary] ? window.ordabankiData.dictionaries[item.fkdictionary] : item.fkdictionary}</em></span></span>
			}
		</div>;
	}

	render() {
		let specialCharLinks = islexHelper.specialChars.map(function(char) {
			return <a key={char} onClick={function(event) {
				event.preventDefault();

				this.setState({
					searchBoxInput: this.state.searchBoxInput+char
				}, function() {
					this.refs.searchInput.refs.inputField.focus();

					setTimeout(function() {
						this.refs.searchInput.refs.inputField.selectionStart = this.state.searchBoxInput.length;
						this.refs.searchInput.refs.inputField.selectionEnd = this.state.searchBoxInput.length;
					}.bind(this), 1);
				}.bind(this));
			}.bind(this)}>{char}</a>
		}.bind(this));

		return (
			<div className="form-group row">
				<div className="col-9 col-sm-10 col-md-11">
					<AutocompleteInput inputClassName="form-control"
						ref="searchInput"
						responseDataField="results"
						searchUrl={config.apiRoot+'/api/es/flettur/?fletta=$s*&simple=true'}
						onChange={this.inputChangeHandler}
						inputName="searchBoxInput"
						value={this.state.searchBoxInput}
						type="text"
						onEnter={this.executeSearch}
						onItemSelect={this.searchBoxItemSelectHandler}
						placeholder={window.l('Leitarorð')}
						minChars={2}
						valueField="fletta"
						selectedItemClass="active"
						onFocus={this.inputFocusHandler}
						disableAutoFill={false}
						headerText={'&nbsp;'}
						listLabelFormatFunc={this.formatAutocompleteListItems}
					/>
					<div className="search-helpers">{specialCharLinks}</div>

					<div className="form-check float-right">
						<ToggleSwitch label={window.l('Leita í texta')} onChange={this.inputChangeHandler} name="textaleitInput" value={this.state.textaleitInput} />
					</div>
				{
					/*
					<input name="searchBoxInput"
						className="form-control"
						placeholder="Leit í orðabanka"
						type="text"
						value={this.state.searchBoxInput}
						onKeyPress={this.inputKeyPressHandler}
						onChange={this.inputChangeHandler}
					/>
					*/
				}
				</div>
				<div className="col-2 col-md-1">
					<button onClick={this.executeSearch.bind(this)} className="btn btn-primary">{window.l('Leita')}</button>
				</div>
			</div>
		);
	}
}

export default withRouter(SearchBox);
