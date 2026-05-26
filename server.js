//1.IMPORTS (in this part we are just importing what we need)

const express = require('express'); // Framework : a pre made frame work to built server 
const session = require('express-session'); // Manager : it helps to manage the server
const path = require('path'); // Finder : it helps to find all the file in any OS.
const fs = require('fs'); // Reader/Writer : it helps to read and write files

const { initDb } = require('./db/database'); // the logic of database
const authRoutes = require('./routes/auth'); // the logic of login 
const evaluationRoutes = require('./routes/evaluation'); // the logic of evaluation 
const challengeRoutes = require('./routes/challenges'); // the logic of challenges
const successRoutes = require('./routes/success'); // the logic of success 
const adminRoutes = require('./routes/admin'); // the logic of admin page
const pageRoutes = require('./routes/pages'); // the logic of all other pages

//2.Environment Variables

const PORT = process.env.PORT || 3000; // checking .env file to see the port if not found it uses port 3000 as defult
const SESSION_SECRET = process.env.SESSION_SECRET || 'lab-internal-evaluation-secret'; // checking .env file to see the secret key if not found it uses defult string 

//3.Initialization

initDb(); // setting up Database before running anything 

const app = express(); // creating database object 

//4.Middleware

app.use(express.json()); // fentching incoming request but only in JSON 
app.use(express.urlencoded({ extended: true })); //Reading the JSON as HTML form

app.use(session({
  secret: SESSION_SECRET,  // Signs the cookie so it can't be faked
  resave: false, // Signs the cookie so it can't be faked
  saveUninitialized: false, // Don't create empty sessions for every visitor
  cookie: {
    httpOnly: true, // JavaScript in browser CANNOT read this cookie (blocks hackers)
    maxAge: 1000 * 60 * 60 * 24 * 7 // Cookie lives for 7 days then expires
  }
}));

//5.

// Public manifest (Round 3 reconnaissance)
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
}); // Serves manifest.json publicly (used in Round 3 as a clue for players)

app.use('/static', express.static(path.join(__dirname, 'public')));// Any file inside /public folder is accessible at /static/filename (CSS, JS, images)
app.use('/challenges', express.static(path.join(__dirname, 'challenges')));// Files inside /challenges folder are served directly (challenge assets, files, etc.)

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/admin', adminRoutes);

app.use('/challenge', challengeRoutes);
app.use('/success', successRoutes);
app.use('/admin', adminRoutes);

// Hidden Round 3 route — intentionally not in nav
app.get('/_classified/op-greycell', (req, res) => {
  if (!req.session.playerId) return res.redirect('/');
  const { markChallengeSolved } = require('./services/progression');
  markChallengeSolved(req.session.playerId, 3, 'CTF{HIDDEN_PATH_DISCOVERED}');
  res.sendFile(path.join(__dirname, 'views', 'classified.html'));
});

app.use('/', pageRoutes);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(PORT, () => {
  console.log(`\n[ LAB ] Internal Evaluation Platform`);
  console.log(`[ LAB ] Listening on http://localhost:${PORT}\n`);
});
