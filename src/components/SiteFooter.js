import React, { Component } from 'react';

export default function SiteFooter(props) {
	return <div className="site-footer">
		<div className="logos">
			<a href="http://www.dictionaryportal.eu/" target="_blank" title="European Dictionary Portal"><img src="/img/logo-dictionaryportal.gif"/></a>
			<a href="http://www.arnastofnun.is/" target="_blank" title="Stofnun Árna Magnússonar í íslenskum fræðum"><img src="/img/logo-sam.svg"/></a>
			<a href="http://www.dsl.dk/" target="_blank" title="Det Danske Sprog- og Litteraturselskab"><img src="/img/logo-dsl.png"/></a>
			<a href="http://uib.no/lle" target="_blank" title="Universitetet i Bergen"><img src="/img/logo-uib.png"/></a>
			<a href="http://www.svenska.gu.se/" target="_blank" title="Göteborgs universitet "><img src="/img/logo-gub.png"/></a>
			<a href="http://www.setur.fo/" target="_blank" title="Fróðskaparsetur Føroya"><img src="/img/logo-frodskaparsetur.png"/></a>
			<a href="http://www.helsinki.fi/universitetet/" target="_blank" title="Helsingfors universitet"><img src="/img/logo-helsinki.png"/></a>
		</div>
		<div className="footer-text">© Stofnun Árna Magnússonar í íslenskum fræðum, Árnagarði við Suðurgötu, 101 Reykjavík</div>
	</div>;
}