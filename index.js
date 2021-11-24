require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
require('./middleware/auth');
const passport = require('passport');

const app = express();
app.use(express.json());
app.use(passport.initialize());

// Connect Mongo DB
const database = 'userdb';
const mongoConnection = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${database}`;
const connectMongoDb = () => {
    console.log('Connecting to Mongo DB ...');
    mongoose.connect(mongoConnection, {authSource: 'admin', useUnifiedTopology: true})
    .then(() => console.log('Successfully connected to Mongo DB'))
    .catch((err) => {
        console.error('Error while connecting to Mongo DB:', err);
        setTimeout(connectMongoDb, 5000);
    });
};
connectMongoDb();

// Routes
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'Welcome to passport-jwt'
    });
});

const authRoute = require('./route/auth_route');
app.use('/api/v1/auth', authRoute);

const userRoute = require('./route/user_route');
app.use('/api/v1/user', passport.authenticate('jwt', { session: false }), userRoute);

// Handle errors
app.use(function(err, req, res, next) {
    console.error('Some unknown error occurred', err);
    res.status(err.status || 500);
    res.json({ error: err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
});
