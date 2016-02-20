Template.newspaper.helpers({
  news: function () {
    return SelectedNews.find({ }, { sort: { date: 1 } }).fetch();
  },
  mainExists: function () {
    return !!Session.get("mainNews");
  },
  mainImg: function () {
    return Session.get("mainNews").img;
  },
  mainHeadline: function () {
    return Session.get("mainNews").headline;
  },
  mainText: function () {
    return Session.get("mainNews").text;
  },
  mainSourceText: function () {
    return Session.get("mainNews").sourceText;
  },
  mainDate: function () {
    return Session.get("mainNews").date;
  }
});

Template.newspaper.rendered = function () {
  //Session.set('showNewspaper', true);
  $('html, body').animate({scrollTop: $('#newspaper').offset().top + 3 }, 2000);
};

Template.newsArticle.helpers({
  img: function () {
    return this.img;
  }
});
