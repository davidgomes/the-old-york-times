function capital(s){
  if(s == null)
    return ''
  s = s.split(' ');
  for(var i = 0; i < s.length; i++)
    s[i] = s[i].charAt(0).toUpperCase() + s[i].slice(1);
  return s.join(' ');
}

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
        region: capital(dc.region),
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

  const load2 = false, load2new = false;
  if (load2) {
    if (load2new) {
      StarredImages.remove({ });
    }

    const img2Data = Assets.getText('img-starred.json');
    const img2Docs = JSON.parse(imgData);
    for (var i = 0; i < img2Docs.length; i++) {
      const dc = img2Docs[i];

      StarredImages.insert({
        headline: dc.headline,
        score: dc.score
      });

      News.update({ headline: dc.headline }, { $set : { score: dc.score } });
    }
  }

  const dump1 = false;
  if (dump1) {
    console.log('Dumping 1...');
    const imgObject = JSON.stringify(BannedImages.find({ }, { fields : { _id : 0 } }).fetch());
    var path = process.env["PWD"] + "/private/";
    fs.writeFile(path + 'dump1.json', imgObject, function (err) {
      if (err) throw err;
      console.log('Dump 1 done.');
    });
  }

  const dump2 = false;
  if (dump2) {
    console.log('Dumping 2...');
    const imgObject = JSON.stringify(StarredImages.find({ }, { fields : { _id : 0 } }).fetch());
    var path = process.env["PWD"] + "/private/";
    fs.writeFile(path + 'dump2.json', imgObject, function (err) {
      if (err) throw err;
      console.log('Dump 2 done.');
    });
  }

  console.log('Database ready.');
};
