import React, { Component } from 'react';
import { Link } from "react-router-dom";

class AutocompleteInput extends Component {
	constructor(props) {
		super(props);

		this.inputValueChangeHandler = this.inputValueChangeHandler.bind(this);
		this.inputBlurHandler = this.inputBlurHandler.bind(this);
		this.inputFocusHandler = this.inputFocusHandler.bind(this);
		this.inputKeyDownHandler = this.inputKeyDownHandler.bind(this);

		this.state = {
			inputValue: props.value || '',
			data: [],
			listIndex: -1,
			inputValue: ''
		};
	}

	componentWillReceiveProps(props) {
		if (props.value != this.state.inputValue) {
			this.setState({
				inputValue: props.value
			});
		}
	}

	inputValueChangeHandler(event) {
		this.cancelled = false;

		event.persist();

		if (event.target.value == '') {
			this.setState({
				inputValue: '',
				data: [],
				listIndex: -1
			});

			if (this.props.onChange) {
				this.props.onChange({
					target: {
						name: this.props.inputName || '',
						value: ''
					}
				});
			}
		}
		else {
			this.setState({
				inputValue: event.target.value
			}, function() {
				if (this.state.inputValue.indexOf(',') > -1) {
					var inputStrings = this.state.inputValue.split(',');
					var searchValue = inputStrings[inputStrings.length-1];

					if (searchValue != '') {
						this.fetchData(searchValue);
					}
				}
				else {
					this.fetchData(this.state.inputValue);
				}

				if (this.props.onChange) {
					this.props.onChange(event);
				}
			}.bind(this));
		}
	}

	inputKeyDownHandler(event) {
		this.cancelled = false;

		event.persist();

		if (event.keyCode == 38 && this.props.valueField) { // upp
			if (this.state.listIndex > 0) {
				this.setState({
					listIndex: this.state.listIndex-1,
					inputValue: this.assignInputValue(this.props.valueField ? this.state.data[this.state.listIndex-1][this.props.valueField] : this.state.data[this.state.listIndex-1])
				}, function() {
					if (this.props.onChange) {
						this.props.onChange(event);
					}
				}.bind(this));
			}
		}
		if (event.keyCode == 40 && !this.props.disableAutoFill) { // niður
			if (this.state.listIndex < this.state.data.length && this.state.data[this.state.listIndex+1]) {
				this.setState({
					listIndex: this.state.listIndex+1,
					inputValue: this.assignInputValue(this.props.valueField ? this.state.data[this.state.listIndex+1][this.props.valueField] : this.state.data[this.state.listIndex+1])
				}, function() {
					if (this.props.onChange) {
						this.props.onChange(event);
					}
				}.bind(this));
			}
		}
		if (event.keyCode == 13) { // enter
			this.cancelled = true;

			if (this.state.listIndex > -1 && !this.props.disableAutoFill) {
				if (this.props.onItemSelect) {
					this.props.onItemSelect(this.state.data[this.state.listIndex])
				}

				this.setState({
					listIndex: -1,
					data: []
				}, function() {
					if (this.props.onEnter) {
						this.props.onEnter();
					}
				}.bind(this));
			}
			else {
				this.setState({
					listIndex: -1,
					data: []
				}, function() {
					if (this.props.onEnter) {
						this.props.onEnter();
					}
				}.bind(this));
			}
		}

	}

	inputBlurHandler() {
		this.cancelled = true;

		setTimeout(function() {
			this.setState({
				data: [],
				listIndex: -1
			});
		}.bind(this), 200);
	}

	inputFocusHandler(event) {
		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
	}

	assignInputValue(value) {
		if (this.props.disableAutoFill) {
			return;
		}

		var inputValue = this.state.inputValue;

		var ret = '';

		if (inputValue.indexOf(',') > -1) {
			var inputValues = inputValue.split(',');
			inputValues[inputValues.length-1] = value;

			ret = inputValues.join(',');
		}
		else {
			ret = value;
		}
		return ret;
	}

	itemClickHandler(item, dataItem) {
		if (this.props.onItemSelect) {
			this.props.onItemSelect(dataItem)
		}

		this.setState({
			inputValue: this.assignInputValue(item)
		}, function() {
			if (this.props.onChange) {
				this.props.onChange({
					target: {
						name: this.props.inputName || '',
						value: this.state.inputValue
					}
				});
			}
		}.bind(this));
	}

	fetchData(str) {
		if (this.waitingForFetch || (this.props.minChars && str.length < this.props.minChars)) {
			return;
		}

		this.waitingForFetch = true;

		fetch(this.props.searchUrl.replace('$s', str))
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				if (!this.cancelled) {
					let data = json[this.props.responseDataField || 'data'];

					// Hér er hægt að tilgreina fall sem sérsníðir gögnin
					if (this.props.dataFormatFunc) {
						data = this.props.dataFormatFunc(data);
					}

					this.setState({
						data: data,
						listIndex: -1
					});
				}
				this.waitingForFetch = false;
			}.bind(this))
			.catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	render() {
		var items = this.state.data.map(function(item, index) {
			return <a href="#" key={index} className={'list-group-item item'+(this.state.listIndex == index ? ' '+(this.props.selectedItemClass || 'selected') : '')} 
				key={index} 
				onClick={function(event) {
					event.preventDefault();
					this.itemClickHandler(this.props.valueField ? item[this.props.valueField] : item, item);
				}.bind(this)} >
				{
					this.props.listLabelFormatFunc ? this.props.listLabelFormatFunc(item) : this.props.valueField ? item[this.props.valueField] : item
				}
			</a>
		}.bind(this));

		if (items.length > 0) {
			document.body.classList.add('autocomplete-open');
		}
		else {
			document.body.classList.remove('autocomplete-open');
		}

		return <div ref="container" className={'autocomplete-input'+(items.length > 0 ? ' open' : '')}>
			<input className={this.props.inputClassName} 
				ref="inputField"
				type="text" 
				name={this.props.inputName || ''}
				value={this.state.inputValue} 
				onChange={this.inputValueChangeHandler}
				onBlur={this.inputBlurHandler}
				onFocus={this.inputFocusHandler}
				onKeyDown={this.inputKeyDownHandler}
				placeholder={this.props.placeholder} />
			{
				items.length > 0 &&
				<div className="autocomplete-list list-group">
					{
						this.props.headerText &&
						<div className="list-group-item list-group-item-light">
							<small>{this.props.headerText}</small>
						</div>
					}
					{items}
				</div>
			}
		</div>
	}
}

export default AutocompleteInput;
