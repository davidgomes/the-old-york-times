FlowRouter.route('/', {
  action: function (params) {
    BlazeLayout.render("appLayout", { area: "front" });
  }
});
