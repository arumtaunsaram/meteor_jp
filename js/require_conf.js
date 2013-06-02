var require = {
	baseUrl: '/meteor_jp/js/module'
	, paths: {
		'backbone': 'lib/backbone-min-amd-1.0.0'
		, 'underscore': 'lib/underscore-min-amd-1.4.4'
		, 'jquery': 'lib/jquery-1.9.1.min'
		, 'jquery-appear': 'lib/jquery.appear'
	}
	, shim: {
		'underscore': {
			exports: '_'
		}
		, 'backbone': {
			deps: ['underscore']
		}
	}
};
