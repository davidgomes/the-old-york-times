FlowRouter.route('/', {
  action: function (params) {
  	Session.set('gotData', true);
    BlazeLayout.render("appLayout", { area: "front" });
  }
});
const sides = ["left", "right"];
FlowRouter.route('/search/:id', {
  action: function(params) {
  	
    console.log("Param id", params.id);
    Meteor.call('loadSearch', params.id, function(e, res){
    	console.log('received data', res);
    	SelectedNews.remove({});
    	var l = res[0]
    	for(var i=0; i<l.length; i++){

        //SelectedNews.insert(l[i]);
        var item = l[i];
        SelectedNews.insert({
              text: item.text,
              imageSrc: item.image_link,
              region: item.country,
              headline: item.headline,
              date: printDate(item.date),
              category: categoryShort(item.category),
              categoryText: item.category,
              source: item.source,
              sourceText: sourceText(item.source),
              side: sides[Math.round(Math.random())]
            });
      }

    	Session.set('mainNews', res[1]);
    	Session.set('newsObject', res[2]);
      
      Session.set('showResults', true);

      //$('#front').hide();
      //$('#results-container').show();
      //Session.set('showResults', true);
      //loadNewspaper();
      Session.set('showNewspaper', true)

      BlazeLayout.render("appLayout", { area: "results" });
    });

    }
});

