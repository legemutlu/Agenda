const express = require('express');
const bodyParser = require('body-parser');
const connectDb = require('./config/db');
const app = express();

// Routes
const agenda = require('./routes/api/agenda');
const user = require('./routes/api/user');
const auth = require('./routes/api/auth');
const upload = require('./routes/api/upload');

// Connect Database
connectDb();

// Body Parser ( Parses the text as JSON and exposes the resulting object on req.body. )
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('API is running'));

// Define Routes
app.use('/agenda', agenda);
app.use('/user', user);
app.use('/auth', auth);
app.use('/upload', upload, express.static('uploads'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
