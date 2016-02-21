// Create a list of day and monthnames.
var weekdays = [
  "Sunday", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday",
  "Saturday"
], months = [
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

dateSearchValues = [];
Session.set("DateStart", new Date("01-01-2011"));
Session.set("DateEnd", new Date("01-01-2015"));

Template.slider.rendered = function () {
  var slider = document.getElementById('slider');

  noUiSlider.create(slider, {
    range: {
      'min': [ timestamp('1500') ],
      '40%': [ timestamp('1900') ],
      '90%': [ timestamp('2016') ],
      'max': [ (new Date ()).getTime() ]
    },

    start: [ timestamp('2011'), timestamp('2015') ],

    connect: true,

    step: 7 * 24 * 60 * 60 * 1000,

    pips: {
      mode: 'values',
      values: [timestamp('1500'), timestamp('1900'), timestamp('2016'), (new Date ()).getTime()],
      density: 4
    }
  });

  var dateValues = [
    document.getElementById('range-start'),
    document.getElementById('range-end')
  ];

  slider.noUiSlider.on('update', function (values, handle) {
    dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
    dateSearchValues[handle] = values[handle];

    if (handle == 0) {
      Session.set("DateStart", values[0]);
    } else if (handle == 1) {
      Session.set("DateEnd", values[1]);
    }

    setSpinner();
  });

  slider.noUiSlider.on('end', function(){
    if (Session.get("showNewspaper")) {
      loadNewspaper();
      fillNewspaper();
    }
  });

  $('.noUi-value').eq(0).text('1500');
  $('.noUi-value').eq(1).text('1900');
  $('.noUi-value').eq(2).text('2016');
  $('.noUi-value').eq(3).text('Today');
};
