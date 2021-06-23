import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";

class ContactForm extends Component {
	constructor(props) {
		super(props);

		this.grecaptchaKey = '6Ldu6a4UAAAAANsP74uOE6741n4rw0jNDRJkmpev';
		this.apiUrl = '//ritaskra.arnastofnun.is/api/fyrirspurnir/fyrirspurn/';

		this.formInputChangeHandler = this.formInputChangeHandler.bind(this);
		this.sendButtonClickHandler = this.sendButtonClickHandler.bind(this);

		this.state = {
			formData: {
				sendandi: '',
				sendandi_netfang: '',
				sendandi_simanumer: '',
				skilabod: ''
			},
			grecaptchaResponse: false,
			formSuccess: false
		}
	}

	formInputChangeHandler(event) {
		let value = event.target.type && event.target.type == 'checkbox' ? event.target.checked : event.target.value;

		let formData = this.state.formData;

		formData[event.target.name] = value;

		this.setState({
			formData: formData
		});
	}

	validateForm() {
		let validationError = [];
		if (this.state.formData.sendandi &&
			this.state.formData.sendandi_netfang &&
			this.validateEmail(this.state.formData.sendandi_netfang) &&
			this.state.formData.skilabod
		) {
			this.setState({
				validationError: []
			});

			return true;
		}
		else {
			if (!this.state.formData.sendandi || !this.state.formData.skilabod) {
				validationError.push(this.props.messageErrorText || 'Þú verður að skrifa nafnið þitt og skilaboð.');
			}
			if (!this.state.formData.sendandi_netfang || !this.validateEmail(this.state.formData.sendandi_netfang)) {
				validationError.push(this.props.emailErrorText || 'Þú verður að skrifa gilt netfang.');
			}

			//if (this.state.formData.sendandi_netfang && !nyyrdiHelper.validateEmail(this.state.formData.sendandi_netfang)) {
			//	validationError.push('Þú verður að skrifa gilt netfang.');
			//}

			this.setState({
				validationError: validationError
			});

			return false;
		}
	}

	prepareData(data) {
		let ret = {};

		for (let key in data) {
			ret[key] = data[key];
		}

		return ret;
	}

	sendButtonClickHandler(event) {
		event.preventDefault();

		if (this.validateForm()) {
			let formDataValues = new FormData();
			let formData = this.prepareData(this.state.formData);

			for (var key in formData) {
			    formDataValues.append(key, formData[key]);
			}

			formDataValues.append('recaptcha', this.state.grecaptchaResponse);
			formDataValues.append('form', this.props.formId);

			fetch(this.apiUrl, {
				method: 'post',
				body: formDataValues,
				mode: 'cors'
			})
			.then(function(response) {
				return response.json();
			}.bind(this))
			.then(function(json) {
				if (json.error) {
					this.setState({
						validationError: [this.props.requestErrorText || 'Villa í fyrirspurn.']
					});
				}
				else if (json.success) {
					this.setState({
						validationError: [],
						formSuccess: true
					});
				}
			}.bind(this));
		}
	}

	componentDidMount() {
		// Undirbúum grecaptcha
			// Skilgreinum fall sem kallað er á þegar svör berast frá Google reCaptcha API
		window.grecaptchaCallback = this.grecaptchaCallback.bind(this);

		// Frumstillum reCaptcha til að sjá til þess að virknin verði til staðar síðar meir
		this.initializeReCaptcha();
	}

	componentWillUnmount() {
		window.reCaptchaInitialized = false;
	}

	grecaptchaCallback(event) {
		this.setState({
			grecaptchaResponse: event
		});
	}

	initializeReCaptcha() {
		if (window.reCaptchaInitialized) {
			return;
		}

		let grcInit = function() {
			try {
				if (window.grecaptcha) {
					window.grecaptcha.render('grecaptcha', {
						callback: window.grecaptchaCallback,
						hl: window.currentLang || 'is'
					});

					window.reCaptchaInitialized = true;
				}
			}
			catch (e) {
				setTimeout(grcInit, 500);
			}
		}.bind(this);

		grcInit();
	}

	validateEmail(email) {
		var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		return re.test(String(email).toLowerCase());
	}

	render() {
		return (
			<form className="position-relative">

				<div className="form-group">
					<label htmlFor="sendandi">{this.props.nameLabel || 'Nafn'}</label>
					<input type="text"
						value={this.state.formData.sendandi}
						onChange={this.formInputChangeHandler}
						className="form-control"
						name="sendandi"
						id="sendandi" />
				</div>

				<div className="form-group">
					<label htmlFor="sendandi_netfang">{this.props.emailLabel || 'Netfang'}</label>
					<input type="email"
						value={this.state.formData.sendandi_netfang}
						onChange={this.formInputChangeHandler}
						className="form-control"
						name="sendandi_netfang"
						id="sendandi_netfang" />
				</div>

				{
					this.props.requirePhoneNumber &&
					<div className="form-group">
						<label htmlFor="sendandi_simanumer">{this.props.phoneLabel || 'Símanúmer'}</label>
						<input type="tel"
							value={this.state.formData.sendandi_simanumer}
							onChange={this.formInputChangeHandler}
							className="form-control"
							name="sendandi_simanumer"
							id="sendandi_simanumer" />
					</div>
				}

				<div className="form-group">
					<label htmlFor="skilabod">{this.props.messageLabel || 'Skilaboð'}</label>
					<textarea className="form-control"
						onChange={this.formInputChangeHandler}
						name="skilabod"
						id="skilabod"
						rows="5" value={this.state.formData.skilabod}></textarea>
				</div>

				<div id="grecaptcha"
					className="g-recaptcha mb-3"
					data-sitekey={this.grecaptchaKey}></div>

				{
					this.state.validationError && this.state.validationError.length > 0 &&
					<p><strong dangerouslySetInnerHTML={{__html: this.state.validationError.join('<br/>')}}></strong></p>
				}

				<button disabled={!this.state.grecaptchaResponse} type="submit" className="btn btn-primary" onClick={this.sendButtonClickHandler}>{this.props.sendButtonLabel || 'Senda'}</button>

				{
					this.state.formSuccess &&
					<div className="position-absolute d-flex justify-content-center" style={{
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						padding: 40,
						backgroundColor: '#fff'
					}}>
						<div className="align-self-center align-self-middle text-center">
							<h3>{this.props.takkHeading || 'Takk fyrir'}</h3>
							<p>{this.props.takkText || 'Fyrirspurnin þín hefur verið send og verður svarað eins fljótt og auðið er.'}</p>
						</div>

					</div>
				}

			</form>
		);
	}
}

export default ContactForm;
