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
const Dream = require('./models/dreams');
const Keyword = require('./models/keywords');

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

// const keywordsData = require('./populateKeywords');

// INSERT USING MONGOOSE
// ### Add the keyword test data
// keywordsData.forEach((keyword) => {
//     Keyword.create({
//       word: keyword.word,
//       meaning: keyword.meaning,
//       }, (err, createdKeyword) => {
//          if (err) {
//            console.log(err);
//          } else {
//            console.log(createdKeyword);
//          }
//     });
// });

// app.get('/', (req, res)=>{
//     res.render("auth/login.ejs");
// });

// SEARCH ROUTE
app.get('/search', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const matchingDreams = await Dream.find({
            $and: [
                { $text: { $search: req.query.title } },
                // { score: { $meta: 'textScore' } },
                { public: true }],
        });
        // .sort({ score: { $meta: 'textScore' } });
        console.log(matchingDreams);
        res.render('search.ejs', {
            dreams: matchingDreams,
            currentUser: thisUsersDbId,
        });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// SEARCH ROUTE
// app.get('/search', (req, res) => {
//     Dream.find(
//       { $text: { $search: req.query.title } },
//       { score: { $meta: 'textScore' } })
//       .sort({ score: { $meta: 'textScore' } })
//       .exec((err, matchingDreams) => {
//         if (err) {
//           console.log(err);
//           res.send(err);
//         } else {
//           console.log(req.query.title);
//           console.log(matchingDreams);
//           res.render('search.ejs', {
//             dreams: matchingDreams,
//           });
//         }
//       });
//   });

// home page as login route
app.get('/', async (req, res) => {
    try {
        const thisUsersDbId = req.session.usersDbId;
        const keywords = await Keyword.find();
        res.render('auth/login.ejs', {
            currentUser : thisUsersDbId,
            keywords: keywords,
        });
    } catch (err) {
        res.send(err);
    }
});

app.use('/users', userController);
app.use('/dreams', dreamController);
app.use('/auth', authController);

app.listen(3000, ()=>{
    console.log("server is go");
});

