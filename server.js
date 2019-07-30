var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// Set Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });


// on click first button
     
// Routes

// A GET route for scraping the echoJS website



app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.echojs.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
          console.log(result);
          
  

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an err occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
  

  app.get("/", function(req,res) {

    db.Article.find({})
    .then(function(dbArticle) { 
    // if were able to successfully fins aitcle send them back to the cliente

    var articlesObj = {
        articles: dbArticle
    }
      
    res.render("index", articlesObj)

    })
    .catch(function(err) {
      //if an err ocurred send it to the client
      res.json(err);
    });

  })
  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
  .then(function(dbArticle) { 
    var articlesObj = {
      articles: dbArticle
  }
  // if were able to successfully fins article send them back to the cliente 
    // res.json(dbArticle);
    res.render("saved", articlesObj)
  })
  .catch(function(err) {
    //if an err ocurred send it to the client
    res.json(err);
  });
  });
  
  
  // $(".save-article").on('click', function(){

  //   var articleId = $(this).data('id')
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    db.Article.findOne({ _id : req.params.id}).populate("note")
    .then(function(dbArticle) {
      // if were able to successfully fins aitcle send them back to the cliente 
      res.json(dbArticle);
    })
    .catch(function(err) {
      //if an err ocurred send it to the client
      res.json(err);
    });
  
    // and run the populate method with "note",
    // then responds with the article with the note included
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // TODO
    // ====
  
    db.Note.create(req.body)
    .then(function(dbNote) {
      // if were able to successfully fins aitcle send them back to the client
      
      return db.Article.findOneAndUpdate({ _id :req.params.id }, { note: dbNote._id }, { new: true });
  
    })
    .then ( function (dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(err) {
      //if an err ocurred send it to the client
      res.json(err);
    });
  
// });
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the newnode 
  });
  
  // Start the server
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  
  
  
  
  
  
  


