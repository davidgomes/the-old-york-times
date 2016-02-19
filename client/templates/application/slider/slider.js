// Create a list of day and monthnames.
var
weekdays = [
  "Sunday", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday",
  "Saturday"
],
months = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

// Append a suffix to dates.
// Example: 23 => 23rd, 1 => 1st.
function nth (d) {
  if (d>3 && d<21) return 'th';
  switch (d % 10) {
  case 1:  return "st";
  case 2:  return "nd";
  case 3:  return "rd";
  default: return "th";
  }
}

// Create a string representation of the date.
function formatDate (date) {
  return weekdays[date.getDay()] + ", " +
    date.getDate() + nth(date.getDate()) + " " +
    months[date.getMonth()] + " " +
    date.getFullYear();
}

function timestamp (str) {
  return new Date(str).getTime();
}

Template.slider.rendered = function () {
  var slider = document.getElementById('slider');

  noUiSlider.create(slider, {
    range: {
      'min': [ timestamp('1500') ],
      '80%': [ timestamp('2016') ],
      'max': [ (new Date ()).getTime() ]
    },

    start: [ timestamp('2011'), timestamp('2015') ],

    connect: true,

    step: 7 * 24 * 60 * 60 * 1000,

    pips: {
      mode: 'values',
      values: [timestamp('2016')],
      density: 4
    }
  });


  var dateValues = [
    document.getElementById('range-start'),
    document.getElementById('range-end')
  ];

  slider.noUiSlider.on('update', function( values, handle ) {
    dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
  });

  $('.noUi-value').text('2016');
};
