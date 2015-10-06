$(document).ready(function() {
  var key = 'ctiml.github.io/it-ebooks-data';
  var dataset = [];
  var deferreds = [];
  var dataFiles = [
    'ebooks_dt-2015-09-21.json',
    'ebooks_dt-2015-08-15.json',
    'ebooks_dt-2015-04-22.json'
  ];

  var concatData = function(res) {
    dataset = dataset.concat(res.data);
  }

  var fetchData = function(res) {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem(key + this.url, JSON.stringify(res));
    }
    concatData(res);
  }

  for (var i in dataFiles) {
    var res = null;
    if (typeof(Storage) !== "undefined") {
      var s = localStorage.getItem(key + '/data/' + dataFiles[i]);
      res = JSON.parse(s);
    }
    if (res != null && res.data) {
      concatData(res);
    } else {
      deferreds.push($.getJSON('/data/' + dataFiles[i], fetchData));
    }
  }

  $.when.apply(this, deferreds
  ).then(function() {
    $('#loading').hide();
    $('#dt').show();

    var dt = $('#dt').dataTable({
      //"ajax": window.location.pathname + 'ebooks_dt.json',
      "data": dataset,
      "searchHighlight": true,
      "pageLength": 50,
      "lengthMenu": [[50, 100, 500, 1000, -1], [50, 100, 500, 1000, "All"]],
      "columnDefs": [
        {
          "targets": [2, 3, 9, 10, 11, 12],
          "visible": false,
          "searchable": false
        },
        {
          "targets": [8],
          "searchable": false
        },
        {
          "width": "110px",
          "targets": 6
        },
        {
          "width": "240px",
          "targets": 5
        }
      ]
    });
  });

});
