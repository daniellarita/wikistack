var express = require('express');
var router=express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

//retrieve all wiki pages
router.get('/', function(req, res, next) {
  Page.findAll()
  .then(function(foundPages){
    res.render('index', {pages:foundPages})
  })
  .catch(next);
});

//submit a new page to the database
router.post('/', function(req, res, next) {
User.findOrCreate({
  where: {
    name: req.body.author_name,
    email: req.body.author_email
  }
})
.then(function (values) {

  var user = values[0];

  var page = Page.build({
    title: req.body.page_title,
    content: req.body.page_content,
    tags: req.body.page_status
  });

  return page.save().then(function (page) {
    return page.setAuthor(user);
  })
})
.then(function (page) {
  res.redirect(page.route);
})
.catch(next);
});

//retrieve the "add a page" form
router.get('/add', function(req, res) {
  res.render('addpage')
});

//retrieve individual wiki page
router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then(function(foundPage){
    if (foundPage===null){
      return next (new Error("Sorry, that page was not found."))
    }
    res.render('wikipage', {page:foundPage})
  })
  .catch(next)
});

router.use(function(err, req, res, next){
  console.error(err);
  res.status(500).send(err.message)
})

module.exports=router;
