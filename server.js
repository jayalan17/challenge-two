var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/animals');

var Bear = require('./models/bear');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.set('view engine', 'ejs');


var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next){
  console.log('something is happeneing!');
  next();
});



app.get('/', function(req, res){
    Bear.find(function(err, bears){
      if(err){
        console.log(err)
      } else {
        res.render('index', {title: 'hello world!', bears: bears})
      }
    })
});

router.route('/bears')
  .post(function(req, res){

    var bear = new Bear();

    bear.name = req.body.name;
    bear.age = req.body.age;
    bear.gender = req.body.gender;

    bear.save(function(err, bear){
      if(err){
        console.log(err)
      } else {
        res.json(bear)
      }
    })
  })
  .get(function(req, res){
    Bear.find(function(err, bears){
      if(err){
        console.log(err)
      } else {
        res.json(bears)
      }
    })
  });

router.route('/bears/:bear_id')
  .get(function(req, res){
    Bear.findById(req.params.bear_id, function(err, bear){
      if(err){
        console.log(err);
      } else {
        res.json(bear);
      }
    })
  })
  .put(function(req, res){
    Bear.findById(req.params.bear_id, function(err, bear){
      if(err){
        console.log(err)
      } else {
        bear.name = req.body.name || bear.name;
        bear.age = req.body.age || bear.age;
        bear.gender = req.body.gender || bear.gender;

        bear.save(function(err){
          if(err){
            console.log(err)
          } else {
            res.json({title: "bear updated"})
          }
        })
      }
    })
  })
  .delete(function(req, res){
    Bear.remove({_id: req.params.bear_id}, function(err, bear){
      if(err){
        console.log(err)
      } else {
        res.json({title: 'bear was successfully deleted!'})
      }
    })
  });

app.use('/api', router);

app.listen(port, function(){
  console.log("app listening on port " + port)
});