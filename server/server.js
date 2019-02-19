require('./config/config');

const path = require ('path');
const express = require('express');
const bodyParser = require('body-parser');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var {mongoose} = require('./db/mongoose');
var {Movie} = require('./models/movies');
var app = express();
const port = process.env.PORT;

const publicPath = path.join(__dirname, '../views')
app.use(express.static(publicPath));


app.use(bodyParser.json());



app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.post('/addMovie.html',(req,res) => {

  var movie = new Movie ({
    name:req.body.name,
    genre:req.body.genre,
    year:parseInt(req.body.year)
  });
  Movie.findOne({name:movie.name}).then((movieExist) =>{
    if(movieExist) {

      res.send('this movie is currently on the collection');

    }else{
      if (movie.year<1900||movie.year>2020){

        res.send('wrong year. please try again between 1900-2020');

      }else{
        movie.save().then((doc) => {

          res.send('movie added to the database');

        }, (e) => {

          res.send('something went worng');

        });
        }
      }
  })
})
app.patch('/addRating.html', (req,res) => {

   Movie.findOne({name:req.body.name}).then((movieExist) =>{
    if(movieExist) {
      var votes = movieExist.votes+1;
      if(req.body.rating===''){
        res.send('you have to add rating')
      }
      var rating =parseFloat(req.body.rating)
      if (rating>10 || rating <0){
        res.send('invalid rating please enter rating between 0-10')
      }
      rating = (rating+movieExist.rating*movieExist.votes)/votes
      var body ={rating,votes}
      Movie.findOneAndUpdate({name:req.body.name},{$set: body}, {new: true}).then(movieExist => {

        res.send(''+movieExist.rating)
      })
    } else {
      res.send('no movie in this name on the database')
    }
  }).catch((e)=>{
    res.send('something went worng');
  })
})
app.post('/search.html', (req,res)=>{

  var yearStart = parseInt(req.body.yearStart)
  var yearEnd = parseInt(req.body.yearEnd)
  if(yearStart<1900||yearStart>2020||yearEnd<1900||yearEnd>2020){

    return res.status(201).send('the years for search must be between 1900-2020')
  }
  Movie.find({
    genre:req.body.genre,
    year:{ $gte: yearStart, $lte: yearEnd }
  }).then((movies)=>{
    if(movies.length>0){

      res.status(200).send(movies)
    }else {

      res.status(201).send('didnt find movies');
    }

  }).catch((e)=>{

    res.status(201).send('something went worng')
  })
})

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
module.exports = {app};
