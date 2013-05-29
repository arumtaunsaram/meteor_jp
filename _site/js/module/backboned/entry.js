define(
	['backboned/entry/view'
	, 'backboned/entry/model'
	, 'backboned/entry/collection']
, function(View, Model, Collection){
	var Entry = {};
	Entry.View = View;
	Entry.Model = Model;
	Entry.Collection = Collection;
	return Entry;
});
