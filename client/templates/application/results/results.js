SelectedNews = new Mongo.Collection(null);

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

const sourceText = function (source) {
  switch (source) {
  case "https://en.wikipedia.org":
    return "Wikipedia";
  default:
    return "OnThisDay";
  }
};

Template.results.helpers({
  showNewspaper: function () {
    return Session.get("showNewspaper");
  },

  newsLocation: function () {
    if (currentRegion === "World") {
      return "the entire World";
    } else {
      return regions[currentRegion].name;
    }
  },

  rangeFirst: function () {
    return new Date(+dateSearchValues[0]);
  },

  rangeSecond: function () {
    return new Date(+dateSearchValues[1]);
  }
});

Template.results.events({
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
        Session.set('showNewspaper', true);
        var fs = true;
        SelectedNews.remove({ });
        res.forEach((item) => {
          if (fs) {
            Session.set("mainNews", {
              img: !!Math.round(Math.random()),
              region: item.country,
              headline: item.headline,
              date: printDate(item.date),
              category: categoryShort(item.category),
              categoryText: item.category,
              source: item.source,
              sourceText: sourceText(item.source)
            });
            fs = false;
          } else {
            SelectedNews.insert({
              img: !!Math.round(Math.random()),
              region: item.country,
              headline: item.headline,
              date: printDate(item.date),
              category: categoryShort(item.category),
              categoryText: item.category,
              source: item.source,
              sourceText: sourceText(item.source)
            });
          }
        });
      }
    });
  }
});
