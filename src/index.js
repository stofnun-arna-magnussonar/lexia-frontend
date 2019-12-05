import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import Lang from './lang/Lang';
import 'whatwg-fetch';
import Promise from 'promise-polyfill'; 

/*
Object.assign polyfill
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
*/
if (typeof Object.assign != 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) { // .length of function is 2
			'use strict';
			if (target == null) { // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource != null) { // Skip over if undefined or null
					for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}

// IE 11 backwards compatibility
if (!window.Promise) {
	window.Promise = Promise;
}

//let hostname = window.location.hostname.split('.');

if (window.location.pathname && window.location.pathname.match(/\/[a-z]{2}\//)) {
	Lang.setCurrentLang(window.location.pathname.match(/\/([a-z]{2})\//)[1]);
}

Lang.fetchLangData();

window.Lang = Lang;
window.l = function(phrase) {
	return Lang.get(phrase);
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
