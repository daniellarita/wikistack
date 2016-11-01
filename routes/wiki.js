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
    status: req.body.page_status,
    tags:req.body.page_tags
  });

  return page.save().then(function (page) {
    console.log(page)
    return page.setAuthor(user);
  })
})
.then(function (page) {
  res.redirect(page.route);
})
.catch(next);

console.log(req.body)
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
  .then(function(page){
    if (page===null){
      return next (new Error("Sorry, that page was not found."))
    }

    return page.getAuthor()
    .then(function(author){
      page.author=author;
      res.render('wikipage', {page:page})
    })
  })
  .catch(next)
});

router.get('/search/:tag',function(req,res, next){
  Page.findByTag(req.params.tag)
    .then(function(pages){
      res.render('index',{
        pages:pages
      })
    })
    .catch(next)
})

router.get('/:urlTitle/similar', function(req,res,next){
  Page.findOne({
    where:{
      urlTitle:req.params.urlTitle
    }
  })
  .then(function(page){
    if (page===null){
      return next (new Error("Sorry, that page was not found."))
    }
    return page.findSimilar();
  })
  .then(function(similarPages){
    res.render('index',{
      pages:similarPages
    })
  })
  .catch(next)
})

router.use(function(err, req, res, next){
  console.error(err);
  res.status(500).send(err.message)
})

module.exports=router;
