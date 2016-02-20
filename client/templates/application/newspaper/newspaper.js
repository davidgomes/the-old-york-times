const SelectedNews = new Mongo.Collection(null);

Template.newspaper.helpers({
  news: function () {
    return SelectedNews.find({ }).fetch();
  }
});

Template.newspaper.events({
  'click #btn-news': function() {
    console.log(dateSearchValues[0], dateSearchValues[1]);

    Meteor.call('News.methods.getNews', {
      startYear: new Date(+dateSearchValues[0]),
      endYear: new Date(+dateSearchValues[1]),
      region: "Europe"
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
