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

// app.use(function (req, res, next) {
//     res.renderWithData = function (view, model, data) {
//         model.data = JSON.stringify(data);
//         res.render(view, model);
//     };
//     next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// app.set('view cache', true);

app.post('/addMovie.html',(req,res) => {
  var movie = new Movie ({
    name:req.body.name,
    genre:req.body.genre,
    year:parseInt(req.body.year)
  });
  var message;
  Movie.findOne({name:movie.name}).then((movieExist) =>{
    if(movieExist) {
      //return callback('this movie is currently on the collection')
      message='this movie is currently on the collection';
      // return res.render('addMovie.html',{message:'this movie is currently on the collection'})
    }else{
      if (movie.year<1900||movie.year>2020){
        // return callback('wrong year. please try again between 1900-2020')
        message='wrong year. please try again between 1900-2020';
        // return res.render('addMovie.html',{message:'wrong year. please try again between 1900-2020'})
      }else{
        movie.save().then((doc) => {
          // io.emit('updateMovieList', undefined);
          message='movie added to the database';
          // res.render('addMovie.html',{message:'movie added to the database'})
        }, (e) => {
          // io.emit('errorone', e);
          message='something went worng';
          // res.render('addMovie.html',{message:'something went worng'})
        });
        }
      }
        // res.render('addMovie.html');
      //   var someData= {message};
      //   const Http = new XMLHttpRequest();
      //   const url='http://localhost:3000/addMovie.html';
      //   Http.open("GET", url);
      //   Http.send({ data: JSON.stringify(someData) });
      //   Http.onreadystatechange=(e)=>{
      //   console.log(Http.responseText)
      // }

  })
})

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
module.exports = {app};
