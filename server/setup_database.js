setupDatabase = function (){
  News._ensureIndex({ "date": 1 });

  if (News.find().count() == 0){
    var data = Assets.getText('final-database.json');
    docs = JSON.parse(data);
    for (var i = 0; i < docs.length; i++) {
      const dc = docs[i];
      
      News.insert({
        headline: dc.headline,
        image_link: dc.image_link,
        date: new Date(dc.date),
        region: dc.region,
        country: dc.country,
        source: dc.source,
        category: dc.category,
        text: dc.text,
        score: 0,
        sort_id: (Math.floor((Math.random() * 12000) + 1))
      }, function (err, res) {});

      if (i % 1000 == 0) {
        console.log(i);
      }
    }
  }

  console.log('Database ready.');
};
