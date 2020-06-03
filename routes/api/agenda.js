const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Agenda = require('../../models/Agenda');
const User = require('../../models/User');

// Get All Agendas Current User
router.get('/', auth, async (req, res) => {
  try {
    let date = req.params.date;
    let user = req.user.id;
    const agendas = await Agenda.find().sort({ date: -1 });

    if (!user) {
      return res.status(400).json({ msg: 'There is no agenda for this user' });
    }

    res.json(agendas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create or Update User Agenda
router.post('/', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    bookName,
    author,
    page,
    movieName,
    director,
    seriesName,
    season,
    episode,
    workout,
    work,
  } = req.body;

  // Build Agenda Object
  const agendaFields = {};
  agendaFields.user = req.user.id;
  if (workout) agendaFields.workout = workout;
  if (work) agendaFields.work = work;

  // Build Agenda Object -- Book
  agendaFields.book = {};
  if (bookName) agendaFields.book.bookName = bookName;
  if (author) agendaFields.book.author = author;
  if (page) agendaFields.book.page = page;

  // Build Agenda Object -- Movie
  agendaFields.movie = {};
  if (movieName) agendaFields.movie.movieName = movieName;
  if (director) agendaFields.movie.director = director;

  // Build Agenda Object -- Series
  agendaFields.series = {};
  if (seriesName) agendaFields.series.seriesName = seriesName;
  if (season) agendaFields.series.season = season;
  if (episode) agendaFields.series.episode = episode;

  try {
    var id = req.params.id;
    let agenda = await Agenda.findOne({ user: req.user.id });

    if (agenda) {
      // Update
      console.log('burada');
      agenda = await Agenda.findOneAndUpdate(
        { user: req.user.id },
        { $set: agendaFields },
        { new: true }
      );
      return res.json(agenda);
    }

    // Create
    agenda = new Agenda(agendaFields);
    await agenda.save();
    res.json(agenda);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Agenda By Agenda ID

router.get('/:id', auth, async (req, res) => {
  let date = req.params.date;
  var id = req.params.id;
  try {
    const agenda = await Agenda.findOne({
      _id: id,
    });

    if (!agenda) {
      return res.status(400).json({ msg: 'There is no agenda for this id.' });
    }

    res.json(agenda);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete Agenda
router.delete('/:id', auth, async (req, res, next) => {
  var id = req.params.id;
  try {
    await Agenda.findByIdAndRemove({ _id: id });
    res.json({ msg: 'Agenda Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Reset Agendas
router.delete('/delete', async (req, res, next) => {
  try {
    await Agenda.deleteMany();
    res.json({ msg: 'All Agendas Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
