const express = require('express');
const app = express();
const userController = require('./controllers/userController');
const dreamController = require('./controllers/dreamController');
const authController = require('./controllers/authController');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const requireLogin = require('./middleware/requireLogin');
const showMessagesAndUsername = require('./middleware/showSessionMessages');

app.use(session({
    secret: "sdflawiefuawi3ur487gbisub3w434",
    resave: false,
    saveUninitilized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('short'));
// app.use(requireLogin);
// app.use(showMessagesAndUsername);
require('./db/db');


app.get('/', (req, res)=>{
    res.render("auth/login.ejs");
})

app.use('/users', userController);
app.use('/dreams', dreamController);
app.use('/auth', authController);

app.listen(3000, ()=>{
    console.log("server is go");
});

