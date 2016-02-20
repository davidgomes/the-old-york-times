regions = {
  invalid: {
    name: 'Invalid',
    color: '#bdc3c7',
    hoverColor: '#ecf0f1',

    countries: [
      'GRL', 'ATF'
    ]
  },

  northAmerica: {
    name: 'North America',
    color: '#8e44ad',
    hoverColor: '#9b59b6',
    translate: { x: 0.05, y: -0.13 },
    addTopMargin: false,

    countries: [
      'USA', 'CAN', 'MEX', 'CUB', 'BHS'
    ]
  },

  southAmerica: {
    name: 'South America',
    color: '#d35400',
    hoverColor: '#e67e22',
    translate: { x: -0.05, y: -0.45 },
    addTopMargin: true,

    countries: [
      'ARG', 'BRA', 'BOL', 'PRY', 'URY', 'CHL', 'PER', 'ECU', 'COL', 'VEN', 'GUY', 'SUR', 'GUF', 'TTO', 'FLK', 'NIC', 'CRI', 'PAN', 'HND', 'GTM', 'SLV', 'BLZ', 'DOM', 'HTI', 'JAM', 'PRI'
    ]
  },

  africa: {
    name: 'Africa',
    color: '#c0392b',
    hoverColor: '#e74c3c',
    translate: { x: -0.3, y: -0.35 },
    addTopMargin: true,

    countries: [
      'MAR', 'DZA', 'LBY', 'TUN', 'EGY', 'SDN', 'TCD', 'NER', 'MLI', 'MRT', 'ESH', 'SEN', 'BFA', 'ERI', 'ETH', 'DJI', 'SOM', 'CAF', 'SSD', 'GMB', 'GNB', 'SLE', 'LBR', 'CIV', 'GHA', 'TGO', 'BEN', 'NGA', 'CMR', 'GNQ', 'GAB', 'COG', 'COD', 'UGA', 'KEN', 'RWA', 'BDI', 'TZA', 'AGO', 'ZMB', 'MWI', 'MOZ', 'MDG', 'ZWE', 'BWA', 'NAM', 'ZAF', 'LSO', 'SWZ', 'GIN', 'Somaliland'
    ]
  },

  europe: {
    name: 'Europe',
    color: '#2980b9',
    hoverColor: '#3498db',
    translate: { x: -0.45, y: -0.1 },
    addTopMargin: true,

    countries: [
      'PRT', 'ESP', 'FRA', 'DEU', 'NLD', 'LUX', 'BEL', 'GBR', 'IRL', 'CHE', 'ITA', 'ISL', 'AUT', 'POL', 'CZE', 'HUN', 'Kosovo', 'SVN', 'HRV', 'BIH', 'SRB', 'MNE', 'ALB', 'MKD', 'GRC', 'BGR', 'ROU', 'MDA', 'SVK', 'BLR', 'LTU', 'RUS', 'EST', 'UKR', 'FIN', 'SWE', 'NOR', 'DNK', 'LVA', 'TUR', 'GEO', 'AZE', 'ARM', 'CYP', 'Northern Cyprus'
    ]
  },

  middleEast: {
    name: 'Middle East',
    color: '#16a085',
    hoverColor: '#2ecc71',
    translate: { x: -0.4, y: -0.2 },
    addTopMargin: true,

    countries: [
      'SAU', 'YEM', 'OMN', 'ISR', 'JOR', 'IRQ', 'SYR', 'LBN', 'KWT', 'ARE', 'IRN', 'QAT', 'PSE', 'TKM', 'UZB', 'KAZ', 'PAK', 'AFG', 'TJK', 'KGZ'
    ]
  },

  asia: {
    name: 'Asia',
    color: '#f39c12',
    hoverColor: '#f1c40f',
    translate: { x: -0.55, y: -0.2},
    addTopMargin: true,

    countries: [
      'IND', 'LKA', 'CHN', 'NPL', 'BGD', 'BTN', 'MMR', 'THA', 'MNG', 'LAO', 'VNM', 'KHM', 'PRK', 'KOR', 'JPN', 'TWN', 'PHL'
    ]
  },

  oceania: {
    name: "Oceania",
    color: '#2c3e50',
    hoverColor: '#34495e',
    translate: { x: -0.62, y: -0.45},
    addTopMargin: true,

    countries: [
      'AUS', 'IDN', 'MYS', 'PNG', 'NZL', 'NCL', 'SLB', 'FJI', 'TLS', 'VUT', 'BRN'
    ]
  }
};

getCountryRegion = function (countryID) {
  for (var region in regions) {
    if (regions.hasOwnProperty(region)) {
      if ($.inArray(countryID, regions[region].countries) != -1) {
        return region;
      }
    }
  }

  return null;
};
