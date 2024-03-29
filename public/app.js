
$(document).ready(function () {
  console.log("Ready...!");

  $(document).on("click", ".saveArticleBtn", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId)

    var newObj = {
      saved: true
    }
    $.ajax({
      url: "/article/" + thisId,
      method: "PUT",
      data: newObj
    }).then(function (res) {
      location.reload()
      console.log(res)
    })

  })

  $(document).on("click", ".unSaveArticleBtn", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId)

    var newObj = {
      saved: false
    }
    $.ajax({
      url: "/article/" + thisId,
      method: "PUT",
      data: newObj
    }).then(function (res) {
      location.reload()
      console.log(res)
    })

  })


$(document).on("click",".makeANote", function () {
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  console.log("readymakeANote....");
  

  // Empty the notes from the note section
  $("#notes").empty();

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    // objectId = thisId
   
    url: "/?articles/",
         
    data: "id="+ thisId                        //you can insert url argumnets here to pass to api.php for example "id=5&parent=6"
    // dataType: 'json'



  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

$("document").on('click', "#savenote", function () {

  var articleId = $(this).data('id')

  // When you click the savenote button
  // $(document).on("click", "#savenote", function() {
  //   // Grab the id associated with the article from the submit button
  //   var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
})

})

