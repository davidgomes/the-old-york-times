const convertEpoch = function (date) {
  if (date < 1900) {
    return "medieval";
  } else if (date < 2000) {
    return "classic";
  } else {
    return "modern";
  }
};

const convertMoney = function (date) {
  if (date < 1900) {
    return 20.00;
  } else if (date < 1920) {
    return 15.00;
  } else if (date < 1930) {
    return 115.00;
  } else if (date < 1960) {
    return 40.00;
  } else if (date < 1990) {
    return 60.00;
  } else if (date < 1990) {
    return 60.00;
  } else if (date < 2000) {
    return 80.00;
  } else if (date < 2010) {
    return 120.00;
  } else {
    return 200.00;
  }
};

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
  mainRegion: function () {
    return Session.get("mainNews").region;
  },
  mainText: function () {
    return Session.get("mainNews").text;
  },
  mainSourceText: function () {
    return Session.get("mainNews").sourceText;
  },
  mainDate: function () {
    return Session.get("mainNews").date;
  },
  location: function () {
    return Session.get("newsObject").location;
  },
  fromDay: function () {
    return Session.get("newsObject").fromDay;
  },
  fromDate: function () {
    return Session.get("newsObject").fromDate;
  },
  toDay: function () {
    return Session.get("newsObject").toDay;
  },
  toDate: function () {
    return Session.get("newsObject").toDate;
  },
  epoch: function () {
    return convertEpoch(Session.get("newsObject").epoch);
  },
  money: function () {
    return convertMoney(Session.get("newsObject").epoch);
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

UI.registerHelper('capital', function(s, options) {
  s = s.split(' ');
  for(i=0; i<s.length; i++)
    s[i] = s[i].charAt(0).toUpperCase() + s[i].slice(1);
  return s.join(' ');
});