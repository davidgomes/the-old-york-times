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

Template.worldMap.rendered = function () {
  $.each(Datamaps.prototype.worldTopo.objects.world.geometries, function (index, element) {
    if (element.properties.name === 'Kosovo') element.id = 'Kosovo';
    if (element.properties.name === 'Somaliland') element.id = 'Somaliland';
    if (element.properties.name === 'Northern Cyprus') element.id = 'Northern Cyprus';
  });

  var map = new Datamap({
    element: document.getElementById('map-container'),
    responsive: true,

    /*fills: {
     northAmerica: '#e67e22',
     southAmerica: '#f1c40f'
     },
     data: {
     USA: {region: 'northAmerica'},
     CAN: {region: 'northAmerica'},
     BRA: {region: 'southAmerica'},
     MEX: {region: 'southAmerica'}
     },*/

    geographyConfig: {
      popupTemplate: function (geo, data) {
        var countryID = geo.id === "-99" ? geo.properties.name : geo.id; // handle Kosovo, Somaliland, etc.

        console.log(countryID);

        var countryRegion = getCountryRegion(countryID);

        if (countryRegion === null) {
          return '<div class="hoverinfo"><strong>' + countryID + '</strong></div>';
        }

        $.each(regions[countryRegion].countries, function (index, element) {
          $('.datamaps-subunit.' + element).css({
            'fill': regions[countryRegion].hoverColor,
            'stroke': regions[countryRegion].hoverColor,
            'stroke-width': 1
          });
        });

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
  resetColors();

  $(window).on('resize', function () {
    map.resize();
  });
};
