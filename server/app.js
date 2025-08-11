const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const initializeCrons = require('./crons/initializerCron');

const userRouter = require('./routes/userRoutes');
const interviewRouter = require('./routes/interviewRoutes');
const userInteractionRouter = require('./routes/userInteractionRoutes');
const secretsRouter = require('./routes/secretsRoutes');

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

// initializeCrons();

app.use('/api/users', userRouter);
app.use('/api/interviews', interviewRouter);
app.use('/api/user-interactions', userInteractionRouter);
app.use('/api/secrets', secretsRouter);

app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'path not found'
    });
});

module.exports = app;