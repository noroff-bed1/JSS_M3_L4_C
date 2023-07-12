var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");
var request = require('request');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var request = require('request');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  res.render('portfolio', { cakes: JSON.parse(data)});
});

//download image to the server:
var download = function(url, filename, callback){
  request.head(url, function(err, res, body){
    request(url).pipe(fs.createWriteStream(path.resolve(__dirname, '../data/img/'+ filename))).on('close', callback);
  });
};
// Post to add now images
router.post('/', jsonParser, function(req, res, next) {
  const expectedAttributed = ["url", "name", "alt", "category", "header", "description"]
    Object.keys(req.body).forEach(param => {
        if (!(expectedAttributed.includes(param))) {
            res.status(400).end("Wrong Atr");
        }
    });
    if (req.body.url == null || req.body.name == null) {
      res.status(400).end("Url/name not provided");
    }
    if (req.body.category != null) {
      if (!(["wedding", "christmas", "birthday", "anniversary"].includes(req.body.category))) {
         res.status(400).end("Wrong category provided");
      }
    }

  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  if(portfoliosArray.filter(x => x.name === req.body.name).length == 0) {
    download(req.body.url, req.body.name, function(){
      console.log('done');
    });
    const newArray = portfoliosArray.concat([req.body])
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
  }
  res.end();
});
//Delete images
router.delete('/', jsonParser, ensureLoggedIn, function(req, res, next) {
  if (req.body.name == null) {
    res.status(400).end("Name not provided");
  }

  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  const newArray = portfoliosArray.filter(x => x.name !== req.body.name)
  if(newArray.length !== portfoliosArray.length) {
    fs.unlink(path.resolve(__dirname, '../data/img/'+ req.body.name), () => {
      console.log(req.body.name + " deleted!");
    });
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
  }
  res.end();
});

module.exports = router;