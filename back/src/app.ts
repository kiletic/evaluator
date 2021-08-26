import express from 'express';
import path from 'path';
import session from 'express-session';
import mongoose from 'mongoose';

// config
import { dbURI, dbOPTS } from './config/db';

// routes
import route_auth from './routes/auth';

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../front/build")));
app.use(session({
	secret: 'moj sekret',
	resave: false,
	saveUninitialized: true, 
	cookie: { maxAge: 1000 * 60 * 60 * 24 * 2 }
}));


mongoose.connect(dbURI, dbOPTS);

app.use('/', route_auth);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, "../../front/build/index.html"), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.listen(4000, () => console.log('Listening on port 4000...'));

