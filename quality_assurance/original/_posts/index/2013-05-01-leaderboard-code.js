var page = require('webpage').create();

page.viewportSize = { width: 860, height: 800 };

page.open('https://www.meteor.com/examples/leaderboard', function () {

	var doc = page.evaluate(function () {

		var designedRandom = document.getElementById('example-deploy-name').value;

		return document.getElementsByClassName('example-detail')[0].textContent.replace(new RegExp(designedRandom, 'gi'), '');
	});
	console.log(doc);
	phantom.exit();

});
