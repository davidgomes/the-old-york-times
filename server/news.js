Meteor.methods({
  'News.methods.getNews'({ startYear, endYear, region }) {
    new SimpleSchema({
      startYear: { type: Date },
      endYear: { type: Date },
      region: { type: String }
    }).validate({ startYear, endYear, region });

    const regionArray = ["North America", "South America", "Europe", "East Asia", "West Asia", "Africa", "Oceania"];
    let newsList = [];

    console.log("Searching for " + startYear.toString() + " " + endYear.toString());

    if (region == "World") {
      newsList = News.find({ date: { $gt: startYear, $lt: endYear } }, { sort: { score: 1, sort_id: 1 }, limit: 350 }).fetch();
    } else if (_.contains(regionArray, region)) {
      console.log("Searching for " + region);
      newsList = News.find({ date: { $gt: startYear, $lt: endYear }, region: region }, { sort: { score : 1, sort_id: 1 }, limit: 350 }).fetch();
    } else {
      const country = region.toLowerCase();
      newsList = News.find({ date: { $gt: startYear, $lt: endYear }, country: country }, { sort: { score : 1, sort_id: 1 }, limit: 350 }).fetch();
    }

    newsList = _.shuffle(newsList);
    newsList = _.sample(newsList, 18);

    newsList.forEach((item) => {
      const img = BannedImages.findOne({ headline: item.headline });

      if (img) {
        item.image_link = "";
      }
    });

    newsList = _.sortBy(newsList, (item) => { return item.score; });

    return newsList;
  },
  'News.methods.banImage'({ headline }) {
    new SimpleSchema({
      headline: { type: String }
    }).validate({ headline });

    const img = BannedImages.findOne({ headline: headline });

    if (img) {
      return;
    }

    BannedImages.insert({
      headline: headline
    });
  },
  'News.methods.starImage'({ headline }) {
    new SimpleSchema({
      headline: { type: String }
    }).validate({ headline });

    const img = StarredImages.findOne({ headline: headline });

    if (img) {
      StarredImages.update({ _id : img._id },
                           { $inc : score });
    } else {
      StarredImages.insert({
        headline: headline,
        score: 1
      });
    }
  }
});
