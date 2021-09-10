import express from 'express';
import path from 'path';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import Cors from 'cors';
import SubmissionQueue from './submission-queue'
const AutoIncrement = require('mongoose-sequence')(mongoose);

// config
import { dbURI } from './config/db';

// routes
import route_auth from './routes/auth';
import route_tasks from './routes/tasks';
import route_submit from './routes/submit';
import route_judge from './routes/judge';

const app = express();

mongoose.connect(dbURI).then(() => { app.listen(4000, () => console.log('Listening on http://localhost:4000...')) });

app.use(Cors());
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
app.use('/', route_tasks);
app.use('/', route_submit);
app.use('/', route_judge);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, "../../front/build/index.html"), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

const submissionQueue = new SubmissionQueue(4);

export { AutoIncrement, submissionQueue };
