var express = require('express');

//files to server API 
var root = require('./api/root.json');
var child = require('./api/child.json');

var app = express();
var port = 3001;

app.use(express.static('public'))

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.get('/book/:bookId', function(req, res) {
  res.sendFile(__dirname + '/public/book/index.html');
});

app.get('/book/maths', function(req, res) {
  res.sendFile(__dirname + '/public/root.html');
});

//APIs start here
app.get('/api/book/:bookId', function(req,res){
  var bookId = req.params.bookId;
  var item = root[bookId.toLowerCase()];
  var response = {response: null, status: 'OK', statusCode: 200}
  if(item) {
    response.response = item;
    return res.json(response);
  } 
  response.status = 'NOT-FOUND';
  response.statusCode = 404;
  response.response = {
    message: 'Book not found in DB'
  }
  res.status(404).json(response);
});

app.get('/api/book/:bookId/section/:sectionId', function(req,res){
  var bookId = req.params.bookId;
  var sectionId = req.params.sectionId;

  var item = child[bookId.toLowerCase()];
  var response = {response: {}, status: 'OK', statusCode: 200}
  if(item) {
    var sectionItem = item[sectionId];
    if(sectionItem) {
      response.response[sectionId] = sectionItem;
      return setTimeout(function(){
        res.json(response);
      }, (Math.random() * 500 + 500))
    }
  } 
  response.status = 'NOT-FOUND';
  response.statusCode = 404;
  response.response = {
    message: 'Book or section not found in DB'
  }
  res.status(404).json(response);
});

app.get('*', function(req, res) {
  res.send(`<a href=/book/maths> View Maths Book </a>`);
})
app.listen(3001);
console.log('Server listening on http://localhost:' + port);