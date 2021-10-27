$(document).ready(function () {
    $('#idform').submit(function (event) { 
        event.preventDefault();
        event.stopPropagation()
        var comment={
            firstname:  $('input[name=firstname]').val(),
            subject: $('textarea[name=subject]').val(),
        };

        var commentJSON = JSON.stringify(comment);
      
        $.ajax({
            type: "POST",
            url: "http://localhost:7777/idei",
            headers: {
                "Content-Type": "application/json"
            },
            data: commentJSON,
           
            success: function (results) {
               $('#idform').append('<h5 id="name">'+comment.firstname+'</h5>' + '<h6 id="subject">'+comment.subject+'</h6>');
            },
            error: function (results) {
            }
        })
       return false;
        
    });
});



