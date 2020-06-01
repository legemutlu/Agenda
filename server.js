const express = require('express');
const bodyParser = require('body-parser');
const connectDb = require('./config/db');
const app = express();

// Routes
const agenda = require('./routes/api/agenda');

// Connect Database
connectDb();

// Body Parser ( Parses the text as JSON and exposes the resulting object on req.body. )
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('API is running'));

// Define Routes
app.use('/agenda', agenda);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
