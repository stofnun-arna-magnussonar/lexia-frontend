import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import _ from 'underscore';

import islexHelper from './../islexHelper';

class SearchResultsItem extends Component {
	componentDidMount() {
	}

	formatHighlightedText(text) {
		return text.split('<').join('&lt;').split('>').join('&gt;').split('[').join('<').split(']').join('>');
	}

	render() {
		let dataItem = this.props.data;

		let currentLang = window.currentLang || 'is';

		if (dataItem.highlight) {
			if (dataItem.highlight['items.texti']) {
				dataItem.highlight['items.texti'] = _.uniq(dataItem.highlight['items.texti'])
			}
		}

		if (dataItem.inner_hits && dataItem.inner_hits['text_hits'] && dataItem.inner_hits['text_hits']['hits']['hits']) {
			dataItem.inner_hits['text_hits']['hits']['hits'] = _.uniq(dataItem.inner_hits['text_hits']['hits']['hits'], function(hitItem) {
				return hitItem._source.texti+':'+hitItem._source.teg;
			})
		}

		if (dataItem.inner_hits && dataItem.inner_hits['phrase_hits'] && dataItem.inner_hits['phrase_hits']['hits']['hits']) {
			dataItem.inner_hits['phrase_hits']['hits']['hits'] = _.uniq(dataItem.inner_hits['phrase_hits']['hits']['hits'], function(hitItem) {
				return hitItem._source.texti;
			})
		}

		let flettaEl;
		if (dataItem.highlight && dataItem.highlight.fletta) {
			flettaEl = <span className="fletta" dangerouslySetInnerHTML={{__html: this.formatHighlightedText(dataItem.highlight.fletta[0])}}></span>;
		}
		else {
			flettaEl = <span className="fletta">{dataItem.fletta}</span>;
		}

		return (
			<React.Fragment>

				<Link to={'/'+currentLang+'/ord/'+dataItem.flid+'/tungumal/'+(localStorage.getItem('selected-lang') || 'FRA')}>{flettaEl} {dataItem.rnum || ''} {islexHelper.formatOfl(dataItem.ofl)}
				{
					dataItem.highlight && dataItem.highlight.ordmyndir && !dataItem.highlight.fletta &&
					<div className="results-example">Orðmynd: <span className="comma-list" dangerouslySetInnerHTML={{__html: this.formatHighlightedText('[span class="d-none"]'+dataItem.highlight.ordmyndir[0]+'[/span]')}} /></div>
				}
				{
					dataItem.highlight && dataItem.highlight['items.texti'] &&
					<div className="results-example">
						{
							dataItem.highlight['items.texti'].map(function(textItem, index) {
								return <div key={index} className="example-item" dangerouslySetInnerHTML={{__html: this.formatHighlightedText(textItem)}} />;
							}.bind(this))
						}
					</div>
				}
				{
					dataItem.inner_hits && dataItem.inner_hits['phrase_hits'] && dataItem.inner_hits['phrase_hits']['hits']['hits'] && dataItem.inner_hits['phrase_hits']['hits']['hits'].length > 0 &&
					<div className="results-example">
						{
							dataItem.inner_hits['phrase_hits']['hits']['hits'].map(function(textItem, index) {
								console.log(textItem.highlight)
								let textItemText = textItem.highlight && textItem.highlight['items.texti'] ? textItem.highlight['items.texti'][0] : textItem._source.texti;
								let rawHtmlText = textItem.highlight && textItem.highlight['items.texti'];

								if (rawHtmlText) {
									return <div key={index} className="example-item" dangerouslySetInnerHTML={{__html: this.formatHighlightedText(textItemText)}}></div>;
								}
								else {
									return <div key={index} className="example-item">{textItemText}</div>;
								}
							}.bind(this))
						}
					</div>
				}
				{
					dataItem.inner_hits && dataItem.inner_hits['text_hits'] && dataItem.inner_hits['text_hits']['hits']['hits'] && dataItem.inner_hits['text_hits']['hits']['hits'].length > 0 &&
					<div className="results-example">
						{
							dataItem.inner_hits['text_hits']['hits']['hits'].map(function(textItem, index) {
								let lang = textItem._source.teg.indexOf('-jafn') > 0 ? textItem._source.teg.replace('-jafn', '') : null;

								let textItemText = textItem.highlight && textItem.highlight['items.texti'] ? textItem.highlight['items.texti'][0] : textItem._source.texti;
								let rawHtmlText = textItem.highlight && textItem.highlight['items.texti'];

								if (rawHtmlText) {
									return <div key={index}><img className="button-flag" src={'/img/flags/'+lang+'.png'} /> <span dangerouslySetInnerHTML={{__html: this.formatHighlightedText(textItemText)}} /></div>;
								}
								else {
									return <div key={index}><img className="button-flag" src={'/img/flags/'+lang+'.png'} /> {textItem._source.texti}</div>;
								}
							}.bind(this))
						}
					</div>
				}
				</Link>

			</React.Fragment>
		);
	}
}

export default withRouter(SearchResultsItem);
