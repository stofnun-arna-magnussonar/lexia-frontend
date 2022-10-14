import React, { Component } from 'react';
import _ from 'underscore';

export default {
	tungumal: {
		'FRA': {
			code: 'fr',
			name: 'Français'
		},
		'TYS': {
			code: 'de',
			name: 'Þýska'
		}
	},

	langCodes: [
		'is', 'fr', 'de'
	],

	specialChars: [
		'á', 'ð', 'é', 'í', 'ó', 'ú', 'ý', 'þ', 'æ', 'ö', 'à', 'â', 'ç', 'è', 'ê', 'ë', 'ï', 'î', 'ô', 'ù', 'û', 'ü', 'ÿ', 'œ'
	],

	getIslexLangCode: function(lang) {
		for (let key in this.tungumal) {
			if (this.tungumal[key].code == lang) {
				return key;
			}
		}

		return null;
	},

	formatOfl: function(ofl) {
		let currentLang = window.currentLang.toLowerCase() || 'is';

		if (window.islexData && window.islexData.oflTrans) {
			let oflObj = _.findWhere(window.islexData.oflTrans, {
				mal: currentLang,
				ofl: ofl
			});

			if (oflObj) {
				return <span className="ofl-ofl" title={oflObj.trofl2}>{oflObj.trofl}</span>;
			}
			else {
				return <span className="ofl-ofl">{ofl}</span>;
			}
		}
		else {
			return <span className="ofl-ofl">{ofl}</span>;
		}
	},

	firstLetterUpperCase: function(str) {
		return str.charAt(0).toUpperCase()+str.slice(1);
	}
}
