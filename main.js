$(document).ready(function() {
  var dt = $('#dt').dataTable({
    "ajax": '/ebooks_dt.json',
    "pageLength": 100,
    "lengthMenu": [[50, 100, 500, 1000, -1], [50, 100, 500, 1000, "All"]],
    "columnDefs": [
      {
        "targets": [2, 3, 9, 10],
        "visible": false,
        "searchable": false
    },
    {
        "targets": [8, 11, 12],
        "searchable": false
    }
    ]
  });
});
