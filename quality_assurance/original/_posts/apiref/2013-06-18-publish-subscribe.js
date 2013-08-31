var page = require('webpage').create();

page.viewportSize = { width: 860, height: 800 };

page.open('https://docs.meteor.com/', function () {

	var doc = page.evaluate(function () {
			/**
				@type {string}
			 */
		var rtn = '',
			/**
				@type {HTMLElement}
			 */
		    elHeading = document.getElementById('publishandsubscribe'),
			/**
				@type {HTMLElement}
			 */
		    aboveFolding = elHeading;


		while(aboveFolding.nextSibling) {
			if (aboveFolding.nextSibling.tagName && aboveFolding.nextSibling.tagName.toLowerCase() === 'h2') {
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
