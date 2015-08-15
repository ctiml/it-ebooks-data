$(document).ready(function() {
  var dataset = [];
  var deferreds = [];
  var dataPaths = [
    window.location.pathname + 'data/ebooks_dt-2015-04-22.json',
    window.location.pathname + 'data/ebooks_dt-2015-08-15.json'
  ];

  for (var i in dataPaths) {
    deferreds.push($.getJSON(dataPaths[i], function(res) {
      dataset = dataset.concat(res.data);
    }));
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
