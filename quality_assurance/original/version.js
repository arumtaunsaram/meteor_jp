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
		    elHeading = document.querySelector('#nav-inner>h1').children[0].innerHTML,
			/**
				@type {HTMLElement}
			 */
		    aboveFolding = elHeading;


		return elHeading;
	});
	console.log(doc);
	phantom.exit();

});
