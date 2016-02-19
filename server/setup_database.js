

setupDatabase = function(){
  if(News.find().count() == 0){
    var data = Assets.getText('final-database.json');
    docs = JSON.parse(data);
    for(i=0; i<docs.length; i++){
      News.insert(docs[i]);
      if(i % 1000 == 0)
        console.log(i)
    }
  }

  console.log('Database ready.');
}
