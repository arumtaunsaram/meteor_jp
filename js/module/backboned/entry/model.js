define(['backbone', 'jquery', 'underscore'], function (Backbone, $, _) {

	var PARTICLE_NUMBER_OF_LINE = 4;

	var Entry = Backbone.Model.extend({

		defaults: function () {
			return {
				id: ''
				, isInspired: false
				, isExpanded: false
				, title: ''
				, link: ''
				, doctype: 'startguide'
				, basedir: ''
				, rawcontent: ''
				, particle: ''
				, hashFragment: ''
			};
		}

		/**
		   Returns a url string used when fetches.

		   @override
		   @this {entry}
		   @return {string}
		 */
		, url: function () {
			return this.get('basedir') + this.get('link');
		}

		/**
		   Gives dataType:text to option so that Backbone fetches HTML.

		   @override
		   @this {entry}
		   @param {?Object<string, ?>} opt
		 */
		, fetch: function (opt_options) {
			var self = this;
			var opt = opt_options || {};

			opt['dataType'] = 'text';
			self.constructor.__super__.fetch.call(self, opt);
		}

		/**
		   Parses responsive data from the server.

		   @override
		   @this {entry}
		   @return {Object<string, ?>} new properties
		 */
		, parse: function (response, options) {
			return {
					rawcontent: response
					, particle: _.head(
									_.reject(
										$(response)
											.find('#entryCore')
											.text()
											.replace(/[\n\r]+/g, '\n')
											.split('\n')
										, function (line) {
											return line.match(/^\s*$/);
										})
						, PARTICLE_NUMBER_OF_LINE).join('\n')
					, isInspired: true
				};
		}
	});

	return Entry;
});
