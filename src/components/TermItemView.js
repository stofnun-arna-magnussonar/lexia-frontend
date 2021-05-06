import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import _ from 'underscore';

import islexHelper from './../islexHelper';
import config from './../config';

class TermItemView extends Component {
	renderAudioEl(dataItem) {
		let audioFormats = dataItem.texti.split('\t')[0].split(',');

		let audioUrl = config.audioUrl+Math.floor(dataItem.flid/1000)+'/'+dataItem.itid;

		return <div className="dict-item dict-framb">
			<audio ref="audioControl" controls>
				{
					audioFormats.map(function(format) {
						return <source key={format} src={audioUrl+'.'+format} type={'audio/'+format}/>
					})
				}
			</audio>
			<a onClick={
				function() {
					this.refs.audioControl.load();
					this.refs.audioControl.play()
				}.bind(this)
			}>{islexHelper.firstLetterUpperCase(window.l(dataItem.texti.split('\t')[1]))}</a>
		</div>;
	}

	getImageUrl(dataItem) {
		function lpad(value, padding) {
			let zeroes = new Array(padding+1).join("0");
			return (zeroes + value).slice(-padding);
		}

		let imageUrl = config.imageUrl+lpad(Math.floor(dataItem.itid/10000), 5)+'/'+dataItem.texti;

		return imageUrl;
	}

	render() {
		let currentLang = window.currentLang || 'is';

		let dataItem = this.props.item;
		let type = dataItem.teg;

		let el;

		let lastTeg = '';

		let subItems = dataItem.pitems && dataItem.pitems.length > 0 ?
			dataItem.pitems.map(function(pitem, index) {
				let termItemView;

				if (this.props.lang) {
					if (
						(
							pitem.teg.toLowerCase().startsWith(this.props.lang.toLowerCase()) ||
							pitem.teg.toLowerCase().endsWith(this.props.lang.toLowerCase()) ||
							pitem.teg.startsWith('NOT-') ||
							pitem.teg == 'OSTÆÐA' ||
							pitem.teg == 'DÆMI' ||
							pitem.teg == 'Z-MERKING' ||
							pitem.teg == 'Z-PERSÓNA' ||
							pitem.teg == 'LIÐUR' ||
							pitem.teg == 'VÍSUN' ||
							pitem.teg == 'MYND' ||
							pitem.teg == 'SOSTÆÐA' ||
							pitem.teg == 'OSAMB' ||
							pitem.teg == 'SOHAUS' ||
							pitem.teg == 'TILFØJELSE' ||
							pitem.teg == 'FRUMLAG' ||
							pitem.teg == 'NOTKUN' ||
							pitem.teg == 'SVIÐ'
						) && !pitem.teg.startsWith('MORFO-')
					) {
						termItemView = <TermItemView key={pitem.itid} lastTeg={lastTeg} lang={this.props.lang} item={pitem} />;
					}
				}
				else {
					termItemView = <TermItemView key={pitem.itid} lastTeg={lastTeg} item={pitem} />;
				}

				lastTeg = pitem.teg;

				return termItemView;
			}.bind(this)) : [];

		if (type == 'STRIK') {
			el = <hr data-type={type} data-itid={dataItem.itid} />;
		}
		else if (type == 'FRAMB') {
			el = this.renderAudioEl(dataItem)
		}
		else if (type == 'BEYGING') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-link mb-3"><a target="_blank" href={dataItem.texti.split('	')[0]}>{window.l('Beyging')}</a></div>;
		}
		else if (type == 'FORM') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-fallstj">{window.l(dataItem.texti)}</div>;
		}
		else if (type == 'FRUMLAG') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-fallstj dict-frumlag">{window.l('subjekt')}: {window.l(dataItem.texti)}</div>;
		}
		else if (type == 'FALLSTJ') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-fallstj">{window.l(dataItem.texti)}</div>;
		}
		else if (type == 'FALLSTJ-FS') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-fallstj"><strong>{dataItem.texti}</strong></div>;
		}
		else if (type == 'MYND') {
			let linkUrl;
			let linkText;

			if (dataItem.pitems && dataItem.pitems.length) {
				try {
					let linkFrags = dataItem.pitems[0].texti.match(/^(\S+)\s(.*)/).slice(1)
					linkUrl = linkFrags[0]
					linkText = linkFrags[1];
				}
				catch(e) {}
			}

			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-image">
				<img src={this.getImageUrl(dataItem)} />
				{
					dataItem.pitems && dataItem.pitems.length > 0 &&
					<div className="image-caption"><a href={linkUrl}>{linkText}</a></div>
				}
			</div>;
		}
		else if (type == 'ISL-TEXTI') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-merking">{dataItem.texti}</div>;
		}
		else if (type == 'Z-LO') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item">({dataItem.texti})</div>;
		}
		else if (type == 'Z-MERKING') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-merking">({dataItem.texti})</div>;
		}
		else if (type == 'Z-PERSÓNA') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-merking"><img style={{maxWidth: 32}} src="/img/icon-person.png"/></div>;
		}
		else if (type == 'Z-HESTUR') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-merking"><img style={{maxWidth: 32}} src="/img/icon-hestur.png"/></div>;
		}
		else if (type == 'LIÐUR') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-section">
				<div className="dict-section-num"> {dataItem.texti}</div>
				{
					subItems
				}
			</div>;
		}
		else if (type == 'WWW') {
			let linkFrags = dataItem.texti.match(/^(\S+)\s(.*)/).slice(1)

			let linkUrl = linkFrags[0]
			let linkText = linkFrags[1];

			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item"><a href={linkUrl}>{linkText}</a></div>;
		}
		else if (type == 'HLUTAR') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item">{dataItem.texti}</div>;
		}
		else if (type == 'NOTKUN') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-text-light"><em>{window.l(dataItem.texti)}</em></div>;
		}
		else if (type == 'SVIÐ') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item"><em>{window.l(dataItem.texti)}</em></div>;
		}
		else if (type.endsWith('-kateg')) {
			el = subItems;
		}
		else if (type == 'DÆMI') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-daemi">
				<div className="daemi">{dataItem.texti}</div>
				{
					dataItem.pitems && dataItem.pitems.length > 0 &&
					dataItem.pitems.map(function(daemiTranslation) {
						let displayLang;

						if (daemiTranslation.teg.match(/^[A-Z]{2,3}-|-[A-Z]{2,3}$/g)) {
							displayLang = daemiTranslation.teg.match(/^[A-Z]{2,3}-|-[A-Z]{2,3}$/g)[0].replace('-', '');
						}

						let TagName = !this.props.lang ? 'div' : 'span';

						return <TagName key={daemiTranslation.itid} data-itid={daemiTranslation.itid} className={'daemi-translation dict-jafn'+(daemiTranslation.skil == '/' || daemiTranslation.skil == ';/' ? ' break-next' : '')}>
							{
								displayLang &&
								<img className="button-flag" title={islexHelper.tungumal[displayLang].name} src={'/img/flags/'+displayLang+'.png'} />
							}
							{daemiTranslation.texti}
						</TagName>
					}.bind(this))
				}
			</div>;
		}
		else if (type.startsWith('NOT-') || type == 'TILFØJELSE') {
			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-notkunarsvid dict-text-light">({dataItem.texti})</div>;
		}
		else if (type == 'SOSTÆÐA' || type == 'OSTÆÐA' || type == 'OSAMB' || type == 'SOHAUS') {
			let displayLang;

			// Athuga hvort fáni eigi að birtast
			if (type.match(/^[A-Z]{2,3}-|-[A-Z]{2,3}$/g)) {
				displayLang = type.match(/^[A-Z]{2,3}-|-[A-Z]{2,3}$/g)[0].replace('-', '');
			}


			el = <div data-type={type} data-itid={dataItem.itid} className={'dict-item '+(type == 'SOSTÆÐA' || type == 'OSTÆÐA' || type == 'OSAMB' ? 'dict-osamband' : 'dict-sohaus')+(this.props.firstLevel ? ' first-level' : '')}>
				{
					displayLang &&
					<img className="button-flag" title={islexHelper.tungumal[displayLang].name} src={'/img/flags/'+displayLang+'.png'} />
				}
				<div className={(type == 'SOSTÆÐA' || type == 'OSTÆÐA' || type == 'OSAMB' ? 'osamband' : 'sohaus')}>{dataItem.texti}</div>
				{
					subItems
				}
			</div>;
		}
		else if (type.startsWith('KOM-')) {
			el = <span data-type={type} data-itid={dataItem.itid} className="inline-skyring dict-text-light">({dataItem.texti})</span>;
		}
		/*
		else if (type == 'SOHAUS') {
			el = <div><strong>SOHAUS</strong></div>;
		}
		*/
		else if (type.indexOf('-jafn') > -1 || type.indexOf('-þýð') > -1 || type.indexOf('-skýr') > -1) {
			let displayLang;

			// Athuga hvort fáni eigi að birtast
			if (type.match(/^[A-Z]{2,3}-|-[A-Z]{2,3}$/g)) {
				displayLang = type.match(/^[A-Z]{2,3}-|-[A-Z]{2,3}$/g)[0].replace('-', '');
			}

			console.log(displayLang)

			// Athuga hér með síðasta tungumál, if displayLang != lastLang ? TagName = 'div'
			let TagName = !this.props.lang ? 'div' : 'span';

			let titleText;
			if (dataItem.pitems && dataItem.pitems.length == 1 && dataItem.pitems[0].teg.startsWith('MORFO-')) {
				titleText = dataItem.pitems[0].texti;
			}

			el = <React.Fragment>
				<TagName data-type={type} data-itid={dataItem.itid} className={'dict-item dict-jafn'+(this.props.firstLevel ? ' first-level' : '')+(dataItem.skil == '/' || dataItem.skil == ';/' ? ' break-next' : '')}>
					{
						displayLang &&
						<img className="button-flag" title={islexHelper.tungumal[displayLang].name} src={'img/flags/'+displayLang+'.png'} />
					}

					<span title={titleText || null}>{dataItem.texti}
						{
							dataItem.skil == ';/' &&
							<React.Fragment>;</React.Fragment>
						}
						{
							titleText &&
							<span className="ml-2 dict-text-lighter">{titleText}</span>
						}
					</span>

					{
						/*
						dataItem.pitems.length == 1 && dataItem.pitems[0].teg.startsWith('MORFO-') &&
						<div className="dict-morfo">{dataItem.pitems[0].texti}</div>
						*/
					}

					{
						subItems
					}
					{
						(dataItem.skil == '/' || dataItem.skil == ';/') &&
						<div className="clear-fix" />
					}
				</TagName>
				{
					//(type == this.props.lastTeg) &&
					//<div className="clearfix" />
				}
			</React.Fragment>;
		}
		else if (type == 'VÍSUN') {
			let visunUrl;
			let visunLink;

			let formatUrlFrag = function(urlFrag) {
				return (urlFrag.split(' ').length > 1 && !isNaN(urlFrag.split(' ')[0]) ? urlFrag.split(' ')[1] : urlFrag);
			}

			if (dataItem.texti.indexOf(':') > -1) {
				let visunParts = dataItem.texti.split(':');
				let visunUrlFrags = visunParts[0].split(', ');
				let visunLinkFrags = visunParts[1].split('\t');

				visunUrl = formatUrlFrag(visunUrlFrags[0])+
					(visunUrlFrags[1] ? '/ofl/'+visunUrlFrags[1].split(' ')[0] : '')+
					(visunUrlFrags[0].split(' ').length > 1 && !isNaN(visunUrlFrags[0].split(' ')[0]) ? '/rnum/'+visunUrlFrags[0].split(' ')[0] : '');
				visunLink = visunLinkFrags[1]+' '+visunLinkFrags[0];
			}
			else {
				let visunFrags = dataItem.texti.split(', ');

				visunUrl = formatUrlFrag(visunFrags[0])+
					(visunFrags[1] ? '/ofl/'+visunFrags[1].split(' ')[0] : '')+
					(visunFrags[0].split(' ').length > 1 && !isNaN(visunFrags[0].split(' ')[0]) ? '/rnum/'+visunFrags[0].split(' ')[0] : '');
				visunLink = <React.Fragment>{visunFrags[0]} {islexHelper.formatOfl(visunFrags[1])}</React.Fragment>;

			}

			el = <div data-type={type} data-itid={dataItem.itid} className="dict-item dict-visun dict-link mt-3"><Link to={'/'+currentLang+'/leit/'+visunUrl+'?synafyrstu'}>{visunLink}</Link></div>;
		}
		else {
			let displayLang;

			// Athuga hvort fáni eigi að birtast
			if (type.match(/^[A-Z]{2,3}-|-[A-Z]{2,3}$/g)) {
				displayLang = type.match(/^[A-Z]{2,3}-|-[A-Z]{2,3}$/g)[0].replace('-', '');
			}

			console.log(displayLang)

			el = <div data-type={type} data-itid={dataItem.itid} style={{border: '1px solid #999'}}>
				<div><strong>VANTAR BIRTINGU: {type}</strong></div>

				<p>
					{
						displayLang &&
						<img className="button-flag" title={islexHelper.tungumal[displayLang].name} src={'/img/flags/'+displayLang+'.png'} />
					}

					{type}: {dataItem.texti}
				</p>
				{
					subItems
				}
			</div>;

			el = null;
		}

		return (el);
	}
}

export default withRouter(TermItemView);
