
Meteor.methods({
  'storeSearch': function(data){
    var mainNews = data[1];
    var newsObject = data[2];
    var data = data[0]
    console.log(data, mainNews, newsObject);
    if(data.length == 0)
      return '';
    
    res = Search.findOne({elements: data});
    if(res != null)
      return res._id;

    console.log(Search.find().count());

    id = Search.insert({elements: data, mainNews: mainNews, newsObject: newsObject});
    console.log('news stored')
    console.log(data, data.length);
    return id
  },
  'loadSearch': function(id){
    var res = Search.findOne(id);
    var elements = res.elements;
    
    //Session.set('mainNews', res.mainNews);
    //Session.set('newsObject', res.newsObject);

    console.log(res.mainNews, res.newsObject);
    console.log(elements)
    //l = News.find({_id: {$in: elements}}).fetch();
    l = []
    for(var i=0; i<elements.length; i++)
      l.push(News.findOne({headline: elements[i] }))
    console.log('results', l)

    return [l, res.mainNews, res.newsObject]
  },
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
