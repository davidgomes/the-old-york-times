FlowRouter.route('/', {
  action: function (params) {
  	Session.set('gotData', true);
    BlazeLayout.render("appLayout", { area: "front" });
  }
});

FlowRouter.route('/search/:id', {
  action: function(params) {
  	
    console.log("Param id", params.id);
    Meteor.call('loadSearch', params.id, function(e, res){
    	console.log('received data', res);
    	SelectedNews.remove({});
    	var l = res[0]
    	for(var i=0; i<l.length; i++)
    		SelectedNews.insert(l[i]);

      data = l

    	Session.set('mainNews', res[1]);
    	Session.set('newsObject', res[2]);
      
      BlazeLayout.render("newspaper", { area: "front" });
    });

    }
});

