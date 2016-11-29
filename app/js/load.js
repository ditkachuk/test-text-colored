(function() {
    $.ajax({url: 'data/data.json', dataType: "json"}).done(function(response) {
        window.app = new window.Application(response);
    });
})();
