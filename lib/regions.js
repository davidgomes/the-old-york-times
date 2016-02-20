regions = {
  northAmerica: {
    name: 'North America',
    color: '#1d9750',
    hoverColor: '#54b57c',
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
    color: '#874d9e',
    hoverColor: '#a65fc3',
    translate: { x: -0.3, y: -0.35 },
    addTopMargin: true,

    countries: [
      'MAR', 'DZA', 'LBY', 'TUN', 'EGY', 'SDN', 'TCD', 'NER', 'MLI', 'MRT', 'ESH', 'SEN', 'BFA', 'ERI', 'ETH', 'DJI', 'SOM', 'CAF', 'SSD', 'GMB', 'GNB', 'SLE', 'LBR', 'CIV', 'GHA', 'TGO', 'BEN', 'NGA', 'CMR', 'GNQ', 'GAB', 'COG', 'COD', 'UGA', 'KEN', 'RWA', 'BDI', 'TZA', 'AGO', 'ZMB', 'MWI', 'MOZ', 'MDG', 'ZWE', 'BWA', 'NAM', 'ZAF', 'LSO', 'SWZ', 'GIN', 'Somaliland'
    ]
  },

  europe: {
    name: 'Europe',
    color: '#2574A9',
    hoverColor: '#2685c4',
    translate: { x: -0.45, y: -0.1 },
    addTopMargin: true,

    countries: [
      'PRT', 'ESP', 'FRA', 'DEU', 'NLD', 'LUX', 'BEL', 'GBR', 'IRL', 'CHE', 'ITA', 'ISL', 'AUT', 'POL', 'CZE', 'HUN', 'Kosovo', 'SVN', 'HRV', 'BIH', 'SRB', 'MNE', 'ALB', 'MKD', 'GRC', 'BGR', 'ROU', 'MDA', 'SVK', 'BLR', 'LTU', 'RUS', 'EST', 'UKR', 'FIN', 'SWE', 'NOR', 'DNK', 'LVA', 'TUR', 'GEO', 'AZE', 'ARM', 'CYP', 'Northern Cyprus'
    ]
  },

  middleEast: {
    name: 'West Asia',
    color: '#de4b47',
    hoverColor: '#fb5b57',
    translate: { x: -0.4, y: -0.2 },
    addTopMargin: true,

    countries: [
      'SAU', 'YEM', 'OMN', 'ISR', 'JOR', 'IRQ', 'SYR', 'LBN', 'KWT', 'ARE', 'IRN', 'QAT', 'PSE', 'TKM', 'UZB', 'KAZ', 'PAK', 'AFG', 'TJK', 'KGZ'
    ]
  },

  asia: {
    name: 'East Asia',
    color: '#f39c12',
    hoverColor: '#fbaa28',
    translate: { x: -0.55, y: -0.2},
    addTopMargin: true,

    countries: [
      'IND', 'LKA', 'CHN', 'NPL', 'BGD', 'BTN', 'MMR', 'THA', 'MNG', 'LAO', 'VNM', 'KHM', 'PRK', 'KOR', 'JPN', 'TWN', 'PHL'
    ]
  },

  oceania: {
    name: 'Oceania',
    color: '#5C97BF',
    hoverColor: '#76b1d9',
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
