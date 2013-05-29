define(['backbone', 'backboned/entry/model'], function (Backbone, Entry) {

	var EntryCollection = Backbone.Collection.extend({
		model: Entry
	});

	return EntryCollection;
});
