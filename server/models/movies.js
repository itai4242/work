var mongoose = require('mongoose');

var Movie = mongoose.model('Movie', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  rating: {
      type: Number,
      default: 0
  },
  votes : {
      type: Number,
      default: 0
  }

});
module.exports = {Movie};
