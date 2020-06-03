const mongoose = require('mongoose');

const AgendaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  book: {
    bookName: {
      type: String,
    },
    author: {
      type: String,
    },
    page: {
      type: Number,
    },
  },
  movie: {
    movieName: {
      type: String,
    },
    director: {
      type: String,
    },
  },
  series: {
    seriesName: {
      type: String,
    },
    season: {
      type: Number,
    },
    episode: {
      type: Number,
    },
  },
  workout: {
    type: Boolean,
  },
  work: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Agenda = mongoose.model('agenda', AgendaSchema);
