const SelectedNews = new Mongo.Collection(null);

Template.newspaper.helpers({
  news: function () {
    return SelectedNews.find({ }).fetch();
  }
});

Template.newspaper.events({
  'click #btn-news': function() {
    Meteor.call('News.methods.getNews', {
      startYear: new Date("1940-01-01"),
      endYear: new Date("1945-01-01"),
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
