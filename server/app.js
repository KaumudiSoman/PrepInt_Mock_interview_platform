const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');
const interviewRouter = require('./routes/interviewRoutes');
const userInteractionRouter = require('./routes/userInteractionRoutes');
const secretsRouter = require('./routes/secretsRoutes');

const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');

const app = express();

app.use(cors({
  // origin: ['http://localhost:4200'],
  credentials: true
}));

app.options('*', cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));

app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/interviews', interviewRouter);
app.use('/api/user-interactions', userInteractionRouter);
app.use('/api/secrets', secretsRouter);

app.all('*', (req, res, next) => {
  const err = new Error(`Cannot find ${req.originalUrl} on this server`);
  err.statusCode = 404;
  next(err);
});

app.use(errorHandlerMiddleware);

module.exports = app;