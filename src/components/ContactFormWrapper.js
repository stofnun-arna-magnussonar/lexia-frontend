import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";

import ContactForm from './ContactForm';

class ContactFormWrapper extends Component {
	render() {
		return (
			<div className={'card content-container mt-4 manual-init'}>
				 <div className="page-content card-body">
						<h2>{window.l('Hafa samband')}</h2>
						<br/>
						<ContactForm formId={'ISLEX'} 
							messageErrorText={window.l('Þú verður að skrifa nafnið þitt og skilaboð.')} 
							emailErrorText={window.l('Þú verður að skrifa gilt netfang.')}
							requestErrorText={window.l('Villa í fyrirspurn.')}
							nameLabel={window.l('Nafn')}
							emailLabel={window.l('Netfang')}
							messageLabel={window.l('Skilaboð')}
							sendButtonLabel={window.l('Senda')}
							takkHeading={window.l('Takk fyrir')}
							takkText={window.l('Fyrirspurn þín hefur verið send og verður svarað eins fljótt og auðið er.')}
						/>
				</div>
			</div>
		);
	}
}

export default ContactFormWrapper;
