const SelectedNews = new Mongo.Collection(null);

Template.newspaper.helpers({
  news: function () {
    return SelectedNews.find({ }, { sort: { date: 1 } }).fetch();
  }
});

const monthList = ["January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December"];
const printDate = function (date) {
  const dateStr = date.getDate().toString() + " of " +
          monthList[date.getMonth().toString()] + ", " +
          date.getFullYear().toString();

  return dateStr;
};

const categoryShort = function (category) {
  switch (category) {
  case "Arts and Entertainment":
    return "arts";
  case "Sports":
    return "sports";
  case "Technology and Science":
    return "tech";
  default:
    return "world";
  }
};

Template.newspaper.events({
  'click #btn-news': function() {
    Meteor.call('News.methods.getNews', {
      startYear: new Date("2000-01-01"),
      endYear: new Date("2004-01-01"),
      region: "Europe"
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        SelectedNews.remove({ });
        res.forEach((item) => {
          SelectedNews.insert({
            headline: item.headline,
            date: printDate(item.date),
            category: categoryShort(item.category),
            source: item.source
          });
        });
      }
    });
  }
});
