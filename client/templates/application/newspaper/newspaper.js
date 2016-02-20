const SelectedNews = new Mongo.Collection(null);

Template.newspaper.helpers({
  news: function () {
    return SelectedNews.find({ }).fetch();
  }
});

Template.newspaper.events({
  'click #btn-news': function() {
    var regionName;

    if (currentRegion === "World") {
      regionName = "World";
    } else {
      regionName = regions[currentRegion].name;
    }

    Meteor.call('News.methods.getNews', {
      startYear: new Date(+dateSearchValues[0]),
      endYear: new Date(+dateSearchValues[1]),
      region: regionName
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        SelectedNews.remove({ });

        res.forEach((item) => {
          SelectedNews.insert({
            headline: item.headline,
            date: item.date
          });
        });
      }
    });
  }
});
