var resetColors = function () {
  $.each(regions, function (regionName, regionObject) {
    $.each(regionObject.countries, function (index, element) {
      $('.datamaps-subunit.' + element).css({
        'fill': regionObject.color,
        'stroke': 'white',
        'stroke-width': 1
      });
    });
  });
};

var leaveWorldState = function () {
  var countryRegionObject = regions[currentRegion];

  state = "world";
  currentRegion = "World";
  Session.set("WorldVar", "World");

  $('#map-container').css('margin-top', '0');

  $.each(regions, function (regionName, regionObject) {
    if (regionName !== currentRegion) {
      $.each(regionObject.countries, function (index, element) {
        $('.datamaps-subunit.' + element).animate({ transform: '', opacity: 1 }, 750);
      });
    } else {
      $.each(regionObject.countries, function (index, element) {
        $('.datamaps-subunit.' + element).animate({ transform: '' }, 750);
      });
    }
  });
};

var state = "world";
currentRegion = "World";
Session.set("WorldVar", "World");
var dx, dy;

Template.worldMap.rendered = function () {
  $.each(Datamaps.prototype.worldTopo.objects.world.geometries, function (index, element) {
    if (element.properties.name === 'Kosovo') element.id = 'Kosovo';
    if (element.properties.name === 'Somaliland') element.id = 'Somaliland';
    if (element.properties.name === 'Northern Cyprus') element.id = 'Northern Cyprus';
  });

  var map = new Datamap({
    element: document.getElementById('map-container'),
    responsive: true,

    geographyConfig: {
      popupTemplate: function (geo, data) {
        var countryID = geo.id === "-99" ? geo.properties.name : geo.id; // handle Kosovo, Somaliland, etc.

        var countryRegion = getCountryRegion(countryID);

        if (countryRegion === null) {
          return '<div class="hoverinfo"><strong>' + countryID + '</strong></div>';
        }

        if (state === "world") {
          $.each(regions[countryRegion].countries, function (index, element) {
            $('.datamaps-subunit.' + element).css({
              'fill': regions[countryRegion].hoverColor,
              'stroke': regions[countryRegion].hoverColor,
              'stroke-width': 1
            });
          });
        }

        $.each(regions, function (regionName, regionObject) {
          if (regionName !== countryRegion) {
            $.each(regionObject.countries, function (index, element) {
              $('.datamaps-subunit.' + element).css('fill', regionObject.color);
            });
          }
        });

        return ['<div class="hoverinfo"><strong>',
                regions[countryRegion].name + ' (' + countryID + ')',
                '</strong></div>'].join('');
      }
    }
  });

  $('.datamaps-subunit').mouseleave(resetColors);

  $('#map-container').click(function (evt) {
    leaveWorldState();
  });

  $('.datamaps-subunit').click(function (evt) {
    var countryRegion = getCountryRegion(evt.currentTarget.classList[1]);

    if (state === "world") {
      var countryRegionObject = regions[countryRegion];
      currentRegion = countryRegion;
      Session.set("WorldVar", currentRegion);

      if (countryRegionObject.addTopMargin) {
        $('#map-container').css('margin-top', '70px');
      }

      $.each(regions, function (regionName, regionObject) {
        if (regionName !== countryRegion) {
          $.each(regionObject.countries, function (index, element) {
            $('.datamaps-subunit.' + element).animate({ transform: `scale(2) translate(${countryRegionObject.translate.x * $('#map-container').width()}, ${countryRegionObject.translate.y * $('#map-container').innerHeight()})`, opacity: 0.3 }, 750);
          });
        } else {
          $.each(regionObject.countries, function (index, element) {
            $('.datamaps-subunit.' + element).animate({ transform: `scale(2) translate(${regionObject.translate.x * $('#map-container').width()}, ${regionObject.translate.y * $('#map-container').innerHeight()})` }, 750);
          });
        }
      });

      state = "region";
    } else {
      if (countryRegion !== currentRegion) {
        leaveWorldState();
      } else { // pick actual country
        console.log('Selected country called ' + evt.currentTarget.classList[1]);
      }
    }

    evt.stopPropagation();
  });

  $(window).keydown(function (evt) {
    if (evt.keyCode === 27) {
      leaveWorldState();
    }
  });

  resetColors();

  d3.select('.datamaps-subunit.GRL').remove();
  d3.select('.datamaps-subunit.ATF').remove();

  $(window).on('resize', function () {
    map.resize();
  });
};
