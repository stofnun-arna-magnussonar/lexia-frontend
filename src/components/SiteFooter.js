import React, { Component } from 'react';

export default function SiteFooter(props) {
	return <div className="site-footer">
		<div className="logos">
			<a href="http://www.arnastofnun.is/"><img src="/img/logo-sam.svg" /></a>
			<a href="http://vigdis.hi.is/"><img src="/img/logo-vigdis.png" alt="" /></a>
			<a href="http://www.centrenationaldulivre.fr/"><img src="/img/CNL-logo54.png" alt="" /></a>
			<img src="/img/logo-MinCulture01.png" alt="" />
			<img src="/img/logo-ministere.png" />
			<a href="http://www.erasmusplus.is/"><img src="/img/erasmus54.png" alt="" /></a>
		</div>
		<div className="footer-text">© Stofnun Árna Magnússonar í íslenskum fræðum Árnagarði við Suðurgötu, 101 Reykjavík<br/>
			© Stofnun Vigdísar Finnbogadóttur í erlendum tungumálum</div>
	</div>;
}
