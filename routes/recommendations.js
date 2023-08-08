var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  res.render('recommendations', { data: JSON.parse(data)
 });
});
//Post New Recommendations
router.post('/', jsonParser, function(req, res, next) {
  const expectedAttributed = ["avatar", "name", "role", "description"]
    Object.keys(req.body).forEach(param => {
      if (!(expectedAttributed.includes(param))) {
        console.log(param);
        res.status(400).end("Wrong Attr");
      }
    });
    if (req.body.avatar == null || req.body.name == null) {
      res.status(400).end("Avatar/name not provided");
    }
    if (!([1, 2, 3].includes(req.body.avatar))) {
      res.status(400).end("Wrong avatar provided")
    }
    
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  let recommendationsArray = JSON.parse(rawdata);
  if(recommendationsArray.filter(x => x.name === req.body.name).length == 0) {
    const newArray = recommendationsArray.concat([req.body])
    fs.writeFileSync(path.resolve(__dirname, "../data/recommendations.json"), JSON.stringify(newArray));
  }
  res.end();
});
//Delete Recommendations
router.delete('/', jsonParser, ensureLogIn, function(req, res, next) {
  if (req.body.name == null) {
    res.status(400).end("Name not provided");
  }
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  let recommendationsArray = JSON.parse(rawdata);
  const newArray = recommendationsArray.filter(x => x.name !== req.body.name)
  if (newArray.length !== recommendationsArray.length ) {
    fs.writeFileSync(path.resolve(__dirname, "../data/recommendations.json"), JSON.stringify(newArray));
  }
  res.end();
});

module.exports = router;
