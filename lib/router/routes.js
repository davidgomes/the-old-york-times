FlowRouter.route('/', {
  action: function (params) {
    console.log('hey');
    BlazeLayout.render("appLayout", { area: "home" });
  }
});
