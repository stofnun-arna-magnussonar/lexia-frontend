
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TermItemView from './TermItemView';
import _ from 'underscore';

import islexHelper from './../islexHelper';

class TermView extends Component {
	render() {
		let dataItem = this.props.data;

		let rnumEl;

		if (dataItem.rnum && dataItem.rnum > 0) {
			rnumEl = <small>{dataItem.rnum} </small>
		}

		// Athuga hvort vísun finnist fyrir orðið, ef missingTranslation = true eiga skilaboðin um að þýðingu
		// vanti ekki að birtast ef vísun er fyrir hendi
		let hasVisun = Boolean(_.findWhere(dataItem.items, {teg: 'VÍSUN'}));

		return (
			<div className="dict-view">

				<div className="dict-word">
				{
					rnumEl
				}
				{dataItem.fletta} <span className="word-class">{islexHelper.formatOfl(dataItem.ofl)}</span></div>
				{
					/*
					dataItem.missingTranslation &&
					<div className="alert alert-warning"><strong>{window.l('Þýðingu vantar')}</strong><br/>
						{window.l('Orðið er í vinnslu')}</div>
					*/
				}
				{
					dataItem.stuttbeyg && dataItem.stuttbeyg != '' &&
					<div className="dict-info alert alert-info">{dataItem.stuttbeyg}</div>
				}
				{
					dataItem.items && dataItem.items.length > 0 &&
					dataItem.items.map(function(item, index) {
						let termItemView = <TermItemView key={index}
							firstLevel={true}
							lang={!dataItem.missingTranslation ? this.props.lang : undefined}
							item={item} />;

						return termItemView;
					}.bind(this))
				}

			</div>
		);
	}
}

export default withRouter(TermView);
