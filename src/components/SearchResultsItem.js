import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import _ from 'underscore';

import islexHelper from './../islexHelper';

class SearchResultsItem extends Component {
	componentDidMount() {
	}

	formatHighlightedText(text) {
		if (this.props.leitarsvid && this.props.leitarsvid == 'texti' && this.props.searchString) {
			return text.split('<').join('&lt;').split('>').join('&gt;').split('[').join('<').split(']').join('>').split(this.props.searchString).join('<strong>'+this.props.searchString+'</strong>');
		}
		else {
			return text;
		}
		//text.split('<').join('&lt;').split('>').join('&gt;').split('[').join('<').split(']').join('>');
	}

	render() {
		let dataItem = this.props.data;

		let currentLang = window.currentLang || 'is';

		let flettaEl = <span className="fletta">{dataItem.fletta}</span>;

		return (
			<React.Fragment>
				<td className="d-sm-block d-md-table-cell">
					<span className="item-fletta" style={{width: '180px', display: 'inline-block'}}><Link to={'/'+currentLang+'/ord/'+dataItem.flid+'/tungumal/'+(localStorage.getItem('selected-lang') || 'FRA')}>{flettaEl} {dataItem.rnum || ''}</Link> {islexHelper.formatOfl(dataItem.ofl)}</span>
				</td>

				<td className="d-sm-block d-md-table-cell">
					{
						dataItem.highlight && dataItem.highlight.ordmyndir && !dataItem.highlight.fletta &&
						<div className="results-example ordmynd">Orðmynd: <span className="comma-list" dangerouslySetInnerHTML={{__html: this.formatHighlightedText('[span class="d-none"]'+dataItem.highlight.ordmyndir[0]+'[/span]')}} /></div>
					}
					{
						this.props.leitarsvid && this.props.leitarsvid == 'texti' &&
						<div className="results-example">
							{
								dataItem.items.map(function(textItem, index) {
									return <div key={index} className="example-item" dangerouslySetInnerHTML={{__html: this.formatHighlightedText(textItem.texti)}} />;
								}.bind(this))
							}
						</div>
					}
					{
						dataItem.inner_hits && dataItem.inner_hits['phrase_hits'] && dataItem.inner_hits['phrase_hits']['hits']['hits'] && dataItem.inner_hits['phrase_hits']['hits']['hits'].length > 0 &&
						<div className="results-example">
							{
								dataItem.inner_hits['phrase_hits']['hits']['hits'].map(function(textItem, index) {
									let textItemText = textItem.highlight && textItem.highlight['items.texti'] ? textItem.highlight['items.texti'][0] : textItem._source.texti;
									let rawHtmlText = textItem.highlight && textItem.highlight['items.texti'];

									return <div key={index} className="example-item">
										{
											rawHtmlText &&
											<Link to={'/'+currentLang+'/ord/'+dataItem.flid+'/tungumal/'+(localStorage.getItem('selected-lang') || 'FRA')+('?itid='+textItem._source.itid)} dangerouslySetInnerHTML={{__html: this.formatHighlightedText(textItemText)}} />
										}
										{
											!rawHtmlText &&
											<div key={index}>
												<Link to={'/'+currentLang+'/ord/'+dataItem.flid+'/tungumal/'+(localStorage.getItem('selected-lang') || 'FRA')+('?itid='+textItem._source.itid)}>{textItemText}</Link>
											</div>
										}
									</div>;
								}.bind(this))
							}
						</div>
					}
					{
						dataItem.inner_hits && dataItem.inner_hits['text_hits'] && dataItem.inner_hits['text_hits']['hits']['hits'] && dataItem.inner_hits['text_hits']['hits']['hits'].length > 0 &&
						<div className="results-example">
							{
								dataItem.inner_hits['text_hits']['hits']['hits'].map(function(textItem, index) {
									let lang = textItem._source.teg.indexOf('-jafn') > 0 ? textItem._source.teg.replace('-jafn', '') : 
										textItem._source.teg.indexOf('-þýð') > 0 ? textItem._source.teg.replace('-þýð', ''): 
										textItem._source.teg.indexOf('-skýr') > 0 ? textItem._source.teg.replace('-skýr', ''): 
										null;

									console.log(lang)

									let textItemText = textItem.highlight && textItem.highlight['items.texti'] ? textItem.highlight['items.texti'][0] : textItem._source.texti;
									let rawHtmlText = textItem.highlight && textItem.highlight['items.texti'];

									if (rawHtmlText) {
										return <div className="lang-item" key={index}>
											{
												lang &&
												<React.Fragment><img className="button-flag" src={'/img/flags/'+lang+'.png'} /> </React.Fragment>
											}
											<Link to={'/'+currentLang+'/ord/'+dataItem.flid+'/tungumal/'+(lang || localStorage.getItem('selected-lang') || 'FRA')+('?itid='+textItem._source.itid)} dangerouslySetInnerHTML={{__html: this.formatHighlightedText(textItemText)}} /></div>;
									}
									else {
										return <div className="lang-item" key={index}>
											{
												lang &&
												<React.Fragment><img className="button-flag" src={'/img/flags/'+lang+'.png'} /> </React.Fragment>
											}
											<Link to={'/'+currentLang+'/ord/'+dataItem.flid+'/tungumal/'+(lang || localStorage.getItem('selected-lang') || 'FRA')+('?itid='+textItem._source.itid)}>{textItem._source.texti}</Link></div>;
									}
								}.bind(this))
							}
						</div>
					}
				</td>
			</React.Fragment>
		);
	}
}

export default withRouter(SearchResultsItem);
