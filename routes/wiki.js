var express = require('express');
var router=express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

//retrieve all wiki pages
router.get('/', function(req, res, next) {
  Page.findAll()
  .then(function(foundPage){
    // elements=[];
    // elements.push(foundPage)
    console.log(foundPage.urlTitle)
    res.render('index', {pages:foundPage})
  })
  .catch(next);
});

//submit a new page to the database
router.post('/', function(req, res, next) {

var page = Page.build({
  title: req.body.page_title,
  content: req.body.page_content
});

// page.save();
// res.json(req.body)

  page.save().then(function(savedPage){
    res.redirect(savedPage.route); // route virtual FTW
  }).catch(next);
});

//retrieve the "add a page" form
router.get('/add', function(req, res) {
  res.render('addpage')
});

//retrieve individual wiki page
router.get('/:urlTitle', function (req, res, next) {
  //console.log(page.author_name)
  //res.render('wikipage', {page:Page})
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then(function(foundPage){
    //res.json(foundPage)
    res.render('wikipage', {page:foundPage})
  })
  .catch(next);

  // page.save().then(function(savedPage){
  // res.redirect(savedPage.route); // route virtual FTW
  // }).catch(next);

});

module.exports=router;
