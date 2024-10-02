import React, { Component } from 'react';

export default function SiteFooter(props) {
	return <div className="site-footer">
		<div className="logos">
			<a href="http://www.arnastofnun.is/"><img src="/img/logo-sam.svg" /></a>
			<a href="https://svf.hi.is/is"><img src="/img/logo-vigdis2.png" alt="" /></a>
			<a href="https://www.univie.ac.at/"><img src="/img/logo-vinarborg.png" alt="" /></a>
			<a href="http://www.centrenationaldulivre.fr/"><img src="/img/CNL-logo54.png" alt="" /></a>
			<a href="https://www.culture.gouv.fr/"><img src="/img/logo-MinCulture01.png" alt="" /></a>
			<a href="http://diplomatie.gouv.fr/"><img src="/img/logo-ministere.png" /></a>
			<a href="http://www.erasmusplus.is/"><img src="/img/erasmus54.png" alt="" /></a>
		</div>
		<div className="footer-text">© Stofnun Árna Magnússonar í íslenskum fræðum<br/>
			© Stofnun Vigdísar Finnbogadóttur í erlendum tungumálum</div>
	</div>;
}
