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
									return <Link to={'/'+currentLang+'/ord/'+dataItem.flid+'/tungumal/'+(localStorage.getItem('selected-lang') || 'FRA')+'?itid='+textItem.itid}><div key={index} className="example-item" dangerouslySetInnerHTML={{__html: this.formatHighlightedText(textItem.texti)}} /></Link>;
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
