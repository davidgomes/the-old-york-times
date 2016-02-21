Template.front.events({
  'click #begin-btn': function () {
    $('#front').fadeOut(750, function () {
      $('#results-container').show(750, function () {
        Session.set('showResults', true);

        $('#results-container').animate({'opacity': 1}, 750);
      });
    });
  }
});
