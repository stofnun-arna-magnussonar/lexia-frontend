import React from 'react';
import { withRouter } from 'react-router-dom';


class MatomoVeftalning extends React.Component {
	componentWillUpdate ({ location, history }) {
		if (window._paq && window._paq.push) {
			const _paq = window._paq;

			if (location.pathname+location.search === this.props.location.pathname+this.props.location.search) {
				return;
			}

			_paq.push(['setCustomUrl', ('/'+location.pathname+location.search).replace('//', '/')]);
			_paq.push(['setDocumentTitle', document.title]);
			_paq.push(['trackPageView']);
		}
	}

	render () {
		return null;
	}
}

export default withRouter(MatomoVeftalning);