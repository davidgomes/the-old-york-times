SelectedNews = new Mongo.Collection(null);

Session.set("newsEmpty", false);

const monthList = ["January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December"];

const sentences = ["The annals of history know nothing about this",
                  "It seems like you've reached a forgotten piece of our existence",
                   "So far nothing happened in this period... Maybe tomorrow",
                  "A secret organization erased all records of this time. Proceed with caution",
                  "Well, nice try, but this was a slow time"];
const sides = ["left", "right"];

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

var parseOrdinal = function (date) {
  switch (date) {
  case "1":
  case "21":
  case "31":
    return "1st";
  case "2":
  case "22":
    return "2nd";
  case "3":
  case "23":
  case "4":
  case "24":
    return date + "rd";
  default:
    return date + "th";
  }
};

const showArrow = function () {
  $("#back-arrow").show();
};

Template.results.helpers({
  showResults: function () {
    return Session.get('showResults');
  },

  showNewspaper: function () {
    return Session.get("showNewspaper");
  },

  newsLocation: function () {
    if (Session.get("WorldVar") === "World") {
      return "the entire World";
    } else if (_.contains(["southAmerica", "northAmerica", "africa", "europe", "middleEast", "asia", "oceania"], Session.get("WorldVar"))) {
      return "all of " + regions[Session.get("WorldVar")].name;
    }
    else {
      return Session.get("WorldVar");
    }
  },

  rangeFirst: function () {
    return printDate(new Date(+Session.get("DateStart")));
  },

  rangeSecond: function () {
    return printDate(new Date(+Session.get("DateEnd")));
  },

  showEmpty: function () {
    return Session.get("newsEmpty");
  }
});

Template.results.events({
  'click #btn-news' : function () {
    var regionName;

    if (currentCountryID === null) {
      if (currentRegion === "World") {
        regionName = "World";
      } else {
        regionName = regions[currentRegion].name;
      }
    } else {
      regionName = getCountryNameFromID(currentCountryID);
    }

    const fromDate = new Date(+dateSearchValues[0]);
    const toDate = new Date(+dateSearchValues[1]);

    Session.set("newsObject", {
      epoch: Math.floor((fromDate.getFullYear() + toDate.getFullYear()) / 2),
      location: regionName,
      fromDay: parseOrdinal(fromDate.getDate().toString()),
      fromDate: (monthList[fromDate.getMonth().toString()] + " " + fromDate.getFullYear().toString()),
      toDay: parseOrdinal(toDate.getDate().toString()),
      toDate: (monthList[toDate.getMonth().toString()] + " " + toDate.getFullYear().toString())
    });

    $('#map-container').fadeOut('slow');

    Meteor.call('News.methods.getNews', {
      startYear: new Date(+dateSearchValues[0]),
      endYear: new Date(+dateSearchValues[1]),
      region: regionName
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        if (res.length == 0) {
          Session.set("newsEmpty", true);
          Session.set('emptyText', sentences[Math.floor(5 * Math.random())]);
        } else {
          Session.set("newsEmpty", false);
        }

        Session.set('showNewspaper', true);
        var fs = true;
        SelectedNews.remove({ });
        Session.set("mainNews", { });
        res.forEach((item) => {
          if (fs) {
            Session.set("mainNews", {
              text: item.text,
              imageSrc: item.image_link,
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
        });

        showArrow();
      }
    });
  }
});
