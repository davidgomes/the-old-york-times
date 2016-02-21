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
      newsList = News.find({ date: { $gt: startYear, $lt: endYear } }, { sort: { sort_id: 1 }, limit: 160 }).fetch();
    } else if (_.contains(regionArray, region)) {
      console.log("Searching for " + region);
      newsList = News.find({ date: { $gt: startYear, $lt: endYear }, region: region }, { sort: { sort_id: 1 }, limit: 160 }).fetch();
    } else {
      const country = region.toLowerCase();
      newsList = News.find({ date: { $gt: startYear, $lt: endYear }, country: country }, { sort: { sort_id: 1 }, limit: 160 }).fetch();
    }

    newsList = _.shuffle(newsList);
    newsList = _.sample(newsList, 18);

    newsList.forEach((item) => {
      const img = BannedImages.findOne({ headline: item.headline });

      if (img) {
        item.image_link = "";
      }
    });

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
  }
});
