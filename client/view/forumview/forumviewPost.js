
Template.forumviewPost.helpers({
  isCommenting: function(_id){
    return !! _.find(Session.get("isCommenting"), function(c){
      return c == _id;
    });
  },
  backgroundColor: function(_id){
    var link = Links.findOne({source:_id});
    if(!link)
      return;
    if(link.type == "agreement")
      return "post-green";
    if(link.type == "disagreement")
      return "post-red";
    if(link.type == "quote")
      return "post-gray";
  },
  maybeSelected: function(_id){
    if(Router.current().params._id == _id)
      return "forumview-selected"
    return ""
  }
});

// For some reason, these event callbacks are called multiple times per click.
// Maybe a FIXME eventually.
Template.forumviewPost.events({
  'click .post-replybutton':function(event){
    var clicked_id = event.target.id.replace("replybutton-", "");
    var commenting = Session.get("isCommenting");
    if(! _.find(commenting, function(c){return clicked_id == c;})){
      commenting.push(clicked_id);
      Session.set("isCommenting", commenting);
    }
  },
  'click .post-closebutton':function(event){
    var clicked_id = event.target.id.replace("closebutton-", "");
    var commenting = Session.get("isCommenting");

    // lodash pull doesn't work for some reason.
    //_.pull(commenting,clicked_id);

    var index = commenting.indexOf(clicked_id);
    if (index > -1) {
      commenting.splice(index, 1)
    }

    Session.set("isCommenting", commenting);
  },
  'click .forumview-submit':function(event){

    // a hack to avoid the multiple event firing thing.
    if(Session.get("hasPosted"))
      return;

    var clicked_id = event.target.id.replace("forumview-submit-", "");
    var commenting = Session.get("isCommenting");

    var username = "anonymous";
    if(Meteor.user()){
      username = Meteor.user().username;
    }

    var nodeBody = document.getElementById("forumview-textbox-" + clicked_id).value;

    var node = {
      username: username,
      body: nodeBody,
      type: "statement",
      root_id: this.root_id,
      user: Meteor.user()
    }

    var edgeTypeBox = document.getElementById("forumview-edge-type");
    var edgeType = edgeTypeBox.options[edgeTypeBox.selectedIndex].value;

    var edge = {};
    edge.type = edgeType;
    edge.root_id = this.root_id
    edge.target_id = this._id;

    Meteor.call('newNode', node, edge)
    Session.set("hasPosted", true);

    // lodash pull doesn't work for some reason.
    //_.pull(commenting,clicked_id);

    var index = commenting.indexOf(clicked_id)
    if (index > -1) {
      commenting.splice(index, 1)
    }

    Session.set("isCommenting", commenting);

    // This shouldn't be necessary, but I don't want to debug it right now.
    location.reload();
  }
});

Template.forumviewPost.rendered = function(){
  if(!Session.get("isCommenting")){
    Session.set("isCommenting", []);
  }
}
