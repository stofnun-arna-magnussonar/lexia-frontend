import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import islexHelper from './../islexHelper';

class LangMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedLang: 'is'
		};
	}

	render() {
		let langEls = [];

		let langList = {
			'IS': {
				code: 'is',
				name: 'Íslenska'
			}
		};

		for (let lang in islexHelper.tungumal) {
			langList[lang] = islexHelper.tungumal[lang];
		}

		for (let lang in langList) {
			langEls.push(<Link key={langList[lang].code} 
				to={'/'+langList[lang].code+'/'} 
				className={langList[lang].code == window.currentLang ? 'active' : null} 
			><img className="button-flag" src={'/img/flags/'+langList[lang].code.toUpperCase()+'.png'}/> {langList[lang].langMenuName || langList[lang].name}</Link>);
		}

		return (
			this.props.inline ?
				<React.Fragment>
					{
						langEls
					}
				</React.Fragment> :
				<div className="menu-links lang-menu">
					{
						langEls
					}
				</div>
		);
	}
}

export default LangMenu;
