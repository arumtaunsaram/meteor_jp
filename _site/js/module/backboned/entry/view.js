define(['underscore', 'backbone', 'jquery-appear'], function(_, Backbone, $) {

	var func_template = function () {}
	  , collection = undefined;

	var EntryView = Backbone.View.extend({

		/**
		   @override
		 */
		events: {
			'click *': 'expand'
		}

		/**
		   @lends func_template
		 */
		, template: function () {
			return func_template.apply(null, arguments);
		}

		/**

		   @override
		   @param {{el:{Element}, model:{Entry}}} opt
				The Element are assumed to be a h3 element with the following
				class and attributes.
				h3:{
					class: +rawentry
					data-doctype: a prepared directory inside _site/doc/
					data-link: a file name inside _site/doc/__data-doctype__/
				}
		 */
		, initialize: function (opt) {
			var self = this;

			if (self.el.tagName.toLowerCase() === 'h3') {

				var	id = self.$el.attr('data-link').replace('.', '').replace('/', '').replace('#', '');
				var length = $('#' + id).size();

				if (length > 0) {
					// If there is an element with the same link value already,
					// make a different id.
					var i = 0;
					while (length > 0) {
						length = $('#' + id + (++i)).size();
					}
					id = id + i;
				}

				self.model.set({
					title: self.$el.html()
					, id: id
					, link:  
						(self.$el.attr('data-doctype')? self.$el.attr('data-doctype') + '/' : '' )
						+ self.$el.attr('data-link')
						+ (self.$el.attr('data-hash-fragment')? '#' + self.$el.attr('data-hash-fragment') : '' )
					, doctype: self.$el.attr('data-doctype')
					, hashFragment: self.$el.attr('data-hash-fragment')
					, expand: function () {
						self.expand.call(self);
					}
				});

				self.$el.replaceWith(self.template({
					id: self.model.get('id')
					, title: self.model.get('title')
					, hrefPermaLink: self.model.get('link')
				}));

				self.setElement(
					// Retrives Element object rather than jQuery object.
					$('#' + self.model.get('id')).get(0)
				);
				self.$el.removeClass('template');

				self.listenTo(self.model, 'change', function () {self.render(); });

				// Activates watching for appearence.
				$('.entry#' + self.model.id).appear();
				// Binds on-appear event to this element.
				$(document.body).on('appear', '.entry#' + self.model.id, function () {
					if (!self.model.get('isInspired')) {
						self.model.fetch();
					}
				});
			}
		}

		/**
			Really needed?
		   @override
		 */
		, render: function () {
			console.log('*** render ***');
			console.log('isInspired:' + this.model.get('isInspired'));
			if (this.model.get('isInspired')) {

				this.$el.addClass('is-inspired');
				this.$('.particleContent').text(this.model.get('particle'));

				var $elMirror = $('.expansionContainer>.sub#' + this.model.get('id'));

				if ($elMirror.size() > 0) {
					$elMirror.html(this.model.get('rawcontent'));
				}
			}
			return this;
		}

		/**

		   @private
		 */
		, expand: function (pmEvt) {
			console.log('expand...');
			var self = this;
			
			console.log(self.model.get('isInspired'));

			if (!self.model.get('isInspired')) {
				self.model.fetch({
					success: function () {self.expandProcedure();}
				});
			} else {
				self.expandProcedure();
			}
			pmEvt.preventDefault();
			console.log('event has been prevented');
		}

		/**
		   Expands with html data stored in its models.

		   @private
		 */
		, expandProcedure: function () {
			var self = this
			  , dst = '';
		
			console.log('*** expandProcedure ***');

			$('#fluidContent').html(
				$(this.model.get('rawcontent')).find('#entryCore')
			);
			$('.volume-selector li a').css('disply', 'inline');

			$('#fluidContent').css('display', 'block');
			$('#solidContent>article').css('display', 'none');
			
			$('#fluidContent').trigger('inject'); 

			dst = self.model.get('link');

			if (self.model.get('hashFragment')){
				dst = '' + dst + '#' + self.model.get('hashFragment');
			}

			Backbone.history.navigate(
				dst , {trigger: false}
			);
		}

		/** 
			Needs index of cached contents in order to 
		 */
		, setCollection: function (pmCollection) {
			collection = pmCollection;
		}
	});

	$(document).ready(function () {
		// Makes a template for entries.
		func_template = _.template($('#entryTemplate').html());
	});

	return EntryView;
});
/* vim: tabstop=4:softtabstop=4:shiftwidth=4:noexpandtab */
