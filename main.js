$(document).ready(function() {
  var dt = $('#dt').dataTable({
    "ajax": window.location.pathname + 'ebooks_dt.json',
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
    }
    ]
  });
});
