//import langData from './langData';
import config from '../config';
import _ from 'underscore';

const defaultLang = 'is';

let langData = {
	'is': {},
	'fr': {}
}

window.langData = langData;

export default {
	collect: false,

	setCurrentLang: function(lang) {
		if (!langData[lang]) {
			return;
		}

		window.currentLang = lang;

		if (window.eventBus) {
			window.eventBus.dispatch('Lang.languageChanged');
		}
	},

	fetchLangData: function() {
		fetch(config.apiRoot+'/api/trans?limit=2000')
			.then(function(response) {
				return response.json();
			})
			.then(function(json) {
				_.each(json.results, function(item) {
					if (langData[item.mal]) {
						langData[item.mal][item.val] = item.trans;
					}
				});

				window.eventBus.dispatch('Lang.languageDataUpdate');
			});
	},

	get: function(phrase) {
		if (window.traceLangGet) {
			console.log('Lang.get: '+phrase);
		}

		if (!window.currentLang) {
			window.currentLang = defaultLang;
		}

		if (this.collect) {
			if (!this.notFound) {
				this.notFound = [];
			}

			if (!langData[window.currentLang] || !langData[window.currentLang][phrase]) {
				if (this.notFound.indexOf(phrase) == -1) {
					this.notFound.push(phrase);
					console.log('Did not find translation for "'+phrase+'"');
				}
			}
		}

		return !langData[window.currentLang] || !langData[window.currentLang][phrase] ? phrase : langData[window.currentLang][phrase];
	}
};
