var page = require('webpage').create();

page.open('http://www.meteor.com/examples/leaderboard', function () {

	var doc = page.evaluate(function () {

		return document.getElementById('example-detail').textContent;
	});
	console.log(doc);
	phantom.exit();

});
