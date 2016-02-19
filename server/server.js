Meteor.startup(function(){
  console.log(News.find().count());
  setupDatabase();
});
