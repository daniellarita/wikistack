var express = require('express');
var router=express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
module.exports=router;
var Promise=require('bluebird');

//GET to /users
router.get('/', function(req,res,next){
  User.findAll()
  .then(function(users){
    res.render('users',{
      users:users
    })
  })
  .catch(next)
})

//GET to /users/id
router.get('/:userId', function(req,res,next){

  var findingUserPages=Page.findAll({
    where: {authorId:req.params.userId}
  })

  var findingUser=User.findById(req.params.userId);

  Promise.all([
    findingUserPages, findingUser
  ])
  .then (function(values){
    var pages=values[0];
    var user=values[1]

    user.pages=pages;
    console.log(user.pages)

    res.render('userpage', {
      user:user
    })
  })
  .catch(next)
})
