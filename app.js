const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('.src/models/user.auth');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();


main().then(() => {
    console.log('db connected successfully')
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/login');

}


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));




app.use(session({
    secret: 'password',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.auth))

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.get('/', (req, res) => {
    res.send('hey, this is root')
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})