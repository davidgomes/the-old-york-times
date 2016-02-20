Template.newspaper.helpers({
  news: function () {
    return SelectedNews.find({ }, { sort: { date: 1 } }).fetch();
  }
});

Template.newspaper.rendered = function () {
  //Session.set('showNewspaper', true);
  $('html, body').animate({scrollTop: $('#newspaper').offset().top + 3 }, 2000);
};
