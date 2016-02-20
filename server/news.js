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
      country = region.toLowerCase()
      newsList = News.find({ date: { $gt: startYear, $lt: endYear }, country: country }, { sort: { sort_id: 1 }, limit: 160 }).fetch();
    }

    newsList = _.shuffle(newsList);
    return _.sample(newsList, 18);
  }
});
