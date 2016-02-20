const SelectedNews = new Mongo.Collection(null);

Template.newspaper.helpers({
  news: function () {
    return SelectedNews.find({ }).fetch();
  }
});

Template.newspaper.events({
  'click #btn-news': function() {
    console.log(regions[currentRegion].name);

    Meteor.call('News.methods.getNews', {
      startYear: new Date(+dateSearchValues[0]),
      endYear: new Date(+dateSearchValues[1]),
      region: regions[currentRegion].name
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        SelectedNews.remove({ });
        console.log(res);
        res.forEach((item) => {
          console.log(item);
          SelectedNews.insert({
            headline: item.headline,
            date: item.date
          });
        });
      }
    });
  }
});
