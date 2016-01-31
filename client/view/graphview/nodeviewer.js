

Template.nodeviewer.selected = function () {
  var selected_id = Session.get("selected");
  var thisNode = Session.get('mousedOver');

  return thisNode;
}

Template.nodeviewer.registeredCommenter = function () {
	var selected = Template.nodeviewer.selected();
	if (selected && selected.user)
		return selected.user;
	return null;
}

Template.nodeviewer.events({
	'click #delete-node': function () {
		Meteor.call("deleteNode", Session.get("selected"));
		Session.set("selected", undefined);
	}
})