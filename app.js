var express=require('express')
var app=express();
app.use(express.static('public'))
var morgan = require('morgan')
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
var nunjucks=require('nunjucks')
// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment
// instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);
var logger=require('./logger');
app.use(logger);
var models = require('./models');
var wikiRouter = require('./routes/wiki');
// ...
app.use('/wiki', wikiRouter);
// or, in one line: app.use('/wiki', require('./routes/wiki'));


app.get('/', function(req,res){
  console.log("hi")
  res.render('index.html')
})

models.User.sync({force: true})
.then(function () {
    return models.Page.sync({force: true})
})
.then(function () {
    app.listen(3000, function () {
        console.log('Server is listening on port 3000!');
    });
})
.catch(console.error);
