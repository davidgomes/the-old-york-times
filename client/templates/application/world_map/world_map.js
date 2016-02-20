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
  state = "world";

  $('#map-container').css('margin-top', '0');

  $.each(regions, function (regionName, regionObject) {
    $.each(regionObject.countries, function (index, element) {
      $('.datamaps-subunit.' + element).show().attr('transform', 'scale(1)');
      $('.datamaps-subunit.' + element).css({ 'opacity': '1' });
    });
  });
}

var state = "world";
var currentRegion = null;

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

      if (countryRegionObject.addTopMargin) {
        $('#map-container').css('margin-top', '70px');
      }

      $.each(regions, function (regionName, regionObject) {
        if (regionName !== countryRegion) {
          $.each(regionObject.countries, function (index, element) {
            //d3.select('.datamaps-subunit.' + element).hide();
            $('.datamaps-subunit.' + element).css({ 'opacity': '0.3' });

            var zoom = d3.behavior.zoom();
            d3.select('.datamaps-subunit.' + element).call(zoom);
            zoom.scale(3);

            d3.select('.datamaps-subunit.' + element).attr('transform', `scale(2) translate(${countryRegionObject.translate.x * $('#map-container').width()}, ${countryRegionObject.translate.y * $('#map-container').innerHeight()})`);
          });
        } else {
          $.each(regionObject.countries, function (index, element) {
            console.log($('#map-container').height());

            d3.select('.datamaps-subunit.' + element).attr('transform', `scale(2) translate(${regionObject.translate.x * $('#map-container').width()}, ${regionObject.translate.y * $('#map-container').innerHeight()})`);
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
