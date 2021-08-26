import express from 'express';
import path from 'path';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

// config
import { dbURI } from './config/db';

// routes
import route_auth from './routes/auth';

const app = express();

mongoose.connect(dbURI).then(() => { app.listen(4000, () => console.log('Listening on http://localhost:4000...')) });

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../front/build")));
app.use(session({
	secret: 'moj sekret',
	resave: false,
	saveUninitialized: true, 
	store: MongoStore.create({
		mongoUrl: dbURI
	})
}));

app.use('/', route_auth);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, "../../front/build/index.html"), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})
