const express = require('express');
const router = express.Router();
const Agenda = require('../../models/Agenda');
const mongoose = require('mongoose');

// Get All Agendas
router.get('/', async (req, res) => {
  let date = req.params.date;
  try {
    const agendas = await Agenda.find().populate(date);
    res.json(agendas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create or Update Agenda
router.post('/', async (req, res, next) => {
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
    let agenda = await Agenda.findOne({ _id: id });

    if (agenda) {
      // Update
      console.log('burada');
      agenda = await Agenda.findOneAndUpdate(
        { _id: id },
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

// Get Agenda By ID

router.get('/:id', async (req, res) => {
  let date = req.params.date;
  let id = req.params.id;
  try {
    const agenda = await Agenda.findOne({
      _id: id,
    }).populate(date);

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
router.delete('/:id', async (req, res, next) => {
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
router.delete('/', async (req, res, next) => {
  try {
    await Agenda.deleteMany();
    res.json({ msg: 'All Agendas Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
