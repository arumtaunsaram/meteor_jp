var page = require('webpage').create();

page.open('http://docs.meteor.com/', function () {

	var doc = page.evaluate(function () {
			/**
				@type {string}
			 */
		var rtn = '',
			/**
				@type {HTMLElement}
			 */
		    elHeading = document.getElementById('concepts'),
			/**
				@type {HTMLElement}
			 */
		    aboveFolding = elHeading;


		while(aboveFolding.nextSibling) {
			if (aboveFolding.nextSibling.tagName && aboveFolding.nextSibling.tagName.toLowerCase() === 'h1') {
				break;
			}

			rtn += aboveFolding.nextSibling.innerText || '';
			aboveFolding = aboveFolding.nextSibling;
		}
		return rtn;
	});
	console.log(doc);
	phantom.exit();

});
