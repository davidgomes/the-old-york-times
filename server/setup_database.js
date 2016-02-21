setupDatabase = function (){
  News._ensureIndex({ "date": 1 });

  if (News.find().count() == 0){
    const data = Assets.getText('final-database.json');
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

  const imgData = Assets.getText('img-banned.json');
  const imgDocs = JSON.parse(imgData);
  for (var i = 0; i < imgDocs.length; i++) {
    const dc = imgDocs[i];

    const img = BannedImages.findOne({ headline: dc.headline });

    if (img) {
      continue;
    }

    BannedImages.insert({
      headline: dc.headline
    });
  }

  const dump = false;
  if (dump) {
    console.log('Dumping...');
    const imgObject = JSON.stringify(BannedImages.find({ }, { fields : { _id : 0 } }).fetch());
    var path = process.env["PWD"] + "/private/";
    fs.writeFile(path + 'dump.json', imgObject, function (err) {
      if (err) throw err;
      console.log('Dump done.');
    });
  }

  console.log('Database ready.');
};
