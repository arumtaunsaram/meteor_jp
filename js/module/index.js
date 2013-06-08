define(['jquery', 'backbone' ,'backboned/entry'], function($, Backbone, Entry) {


	/** @type {Backbone.Collection} */
	var mEntryCollection = new Entry.Collection([])
	/** @type {Array.<<Backbone.View>>} */
	  , backboneViews = []
	/** @type {string} Starts with /, and not trails / */
	  , basePath = '/meteor_jp'
	/** @type {Object.<<string, $|function():$>>}*/
	  , $ui =
		{
		/** @type {function():$} */
			fluidContentContainer: function () {
				return $('#fluidContent');
			}
		}
	/** @type {Array.<string>} */
	  , PATH_PREFIXES_TO_PUSH_STATE = ['/index/', '/concept/', '/apiref/', '/reverseref/']
	/** @type {} */
	  , ID_SOLID_CONTENT = ['', 'index', 'concept', 'apiref', 'reverseref', 'about_meteor', 'about_meteor_kaiso']
		/** 
			For users from bookmarks or who clicks back button.
			@type {Backbone.Router} An instance of a backbone router. 
		*/
	  , mRouter = new (Backbone.Router.extend({
			routes: {
				'*path': 'defaultRoute'
			}
			/**
				@param {?string} path Expected not to include starting '/'.
			 */
			, defaultRoute: function (path){
				//console.log('defaultRoute:' + path);
				//console.log(typeof path);

				//console.log('step 1');
				// If the path is a target to push state, restore its contents.
				if (_.some(PATH_PREFIXES_TO_PUSH_STATE, 
						function (url) {
							// Returns true if url starts with one of PATH_PREFIXES_TO_PUSH_STATE
							return ('/' + path).indexOf(url) === 0;
						})) {

					//console.log('first condition matched');
					var correspondingModel = mEntryCollection.findWhere({link: '/' + path});

					if (correspondingModel) {
						//console.log('corresponding model found');
						(correspondingModel.get('expand'))();
						return;
					} else {
						//console.log('corresponding model not found');
						supplyOutOfCacheTargetContent(path);
						return;
					}
				}
				//console.log('step 2');

				var dstId = _.find(ID_SOLID_CONTENT, function (id) {
					return typeof path === 'string'? path.indexOf(id + '.html') === 0: false;
				});
				//console.log('step 3');
				if (typeof dstId !== 'undefined') {
					//console.log('loading a specific content:' + dstId);
					// TODO: To support query strings and hash fragments (need to split `path` manually)
					loadSolidContent(dstId);
					return;
				}

				//console.log('final judgement.');
				// Go back to the index.
				if (!(path)) {
					//console.log('path false-ish:' + path);
					loadSolidContent();
					return;
				}
				//console.log('all conditions are passed through');
			}
		}))();

	Backbone.history.start({
		pushState: true
		, hashChange: false
		// Skips the first load.
		, silent: true
		, root: '/meteor_jp/'
	}); 
	$(document).ready(function () {
		//console.log('domReady in index.js fired');	

		initSolidContents();

		// Makes Backbone.Model for each .rawentry's.
		$('.rawentry').each(function () {
			var model = new Entry.Model(this);
			mEntryCollection.add(model);
			backboneViews.push(new Entry.View({el: this, model:model}));
		});


		$ui.fluidContentContainer().on('inject', function () {
			//console.log('injected');
			// Maps callbacks to all the anchors inside new contents.
			$(this).find('a').map(function () {
				adaptAnchor(this);
			});
		});

	});

	function initSolidContents () {

		$('.volume-selector a').click(function () {
			window.scroll(0, 0);
		});

		// Makes the anchors inside `volume-selector`,`solidContent` and `footer` internal transitions.
		$('.volume-selector a, #solidContent a, #footer a').each(function () {
			// TODO: to check hostnames.
			var el = this
			/** @type {string?} */
			  , dstId = _.find(ID_SOLID_CONTENT, function (id) {
					// Returns true if url starts with one of PATH_PREFIXES_TO_PUSH_STATE
					return el.pathname === basePath + '/' + id + '.html';
				});

			if (el.getAttribute('href') // false when it returns null or ''
			   && el.getAttribute('href').substr(0, 1) === '#') {
				return;
			}

			if (typeof dstId === 'string') {

				//console.log('Binding a callback..');
				// Copies {string} `dstId` with a new scope.
				(function(dstId) {
					$(el).click(function (evt) {
						//console.log('the callback handled in initSolidContents fired.');
						loadSolidContentAndChangeUrl(dstId, this.search, this.hash);
						evt.preventDefault();
					});
					//console.log('callback binded w/' + dstId);
				})(dstId);
			} else {
				// External links.
				$(el).attr('target', '_blank');
			}
		});

	}

	/**
		@param {?string} pmId
		@param {?string} opt_pmHash (Optional) Expected to start with #.
		@param {?string} opt_pmHash (Optional) Expected to start with #.
	 */
	function loadSolidContent (pmId, opt_pmParameter, opt_pmHash) {

		var dstId = pmId? pmId: 'index';

		$('#fluidContent').css('display', 'none');
		$('#fluidContent').html('');

		$('#solidContent>article').css('display', 'none');
		$('#solidContent').find('#solidArticle_' + dstId).css('display', 'block');

	}

	/**
		@param {?string} pmId
		@param {?string} opt_pmHash (Optional) Expected to start with #.
		@param {?string} opt_pmHash (Optional) Expected to start with #.
	 */
	function loadSolidContentAndChangeUrl (pmId, opt_pmParameter, opt_pmHash) {

		loadSolidContent(pmId, opt_pmParameter, opt_pmHash);

		var path = '/'
			+ (pmId? pmId: 'index') + '.html'
			+ (opt_pmParameter? opt_pmParameter: '')
			+ (opt_pmHash? opt_pmHash: '');

		Backbone.history.navigate(
			path , {trigger: false}
		);
		//console.log('pushing state to:' + path);
	}
	/**
		@param {HTMLAnchorElement} pmTargetAnchor
	 */
	function adaptAnchor (pmTargetAnchor) {

		//console.log('adaptAnchor:' + pmTargetAnchor.href);
		if (typeof pmTargetAnchor['host'] === 'undefined' ||
			typeof pmTargetAnchor['pathname'] === 'undefined'
		) {
			//console.log('adaptAnchor: condition1');
			return false;
		}
	
		// Makes links to external host to load in a new window.
		if (pmTargetAnchor.host.toString() !== location.host.toString()) {
			//console.log('adaptAnchor: condition2');
			$(pmTargetAnchor).attr('target', '_blank');
			return;
		}

		// If url is a target to push state, maps a callback method.
		if (_.some(PATH_PREFIXES_TO_PUSH_STATE, 
				function (url) {
					return pmTargetAnchor.pathname.indexOf(basePath + url) === 0;
				})) {
			$(pmTargetAnchor).on('click', onClickAnchorToPushState);
			return;
		}
	}

	/**
		@this HTMLAnchorElement
		@param {$Event} evt
	 */
	function onClickAnchorToPushState (evt) {
		var correspondingModel = 
				mEntryCollection.findWhere({link: $(this).attr('href')})
		  , path = this.path;

		//console.log('`onClickAnchorToPushState`');
		//console.log($(this).attr('href'));
		//console.log('all available caches:');
		//console.log(mEntryCollection.pluck('link'));

		if (correspondingModel) {
			(correspondingModel.get('expand'))();
			evt.preventDefault();
			return;
		} else {
			// Loads the target content manually.
			//console.log('contents cache not found');
			supplyOutOfCacheTargetContent(path, function () {
				Backbone.history.navigate(
					path , {trigger: false}
				);
			});
		}
	}


	/**
		@param {pmPath} Same format with location.path, it means a path from root rather than relative.
		@param {?function} e.g. A function which defines writing history procedure.
	 */
	function supplyOutOfCacheTargetContent (pmPath, opt_callback) {
		//console.log('fallen into supplyOutOfCacheTargetContent:' + pmPath);

		$.get(location.protocol + '//' + location.host + basePath + '/' + pmPath, function(data) {
			$('#fluidContent').html($(data).find('#entryCore'));
			$('#fluidContent').css('display', 'block');
			$('#solidContent>article').css('display', 'none');
			$('#fluidContent').trigger('inject'); 

			if (typeof opt_callback === 'function') {
				opt_callback();
			}
		});
	}
});
