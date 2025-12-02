const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')

const app = express()
const PORT = 3000

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err))


// User schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', userSchema)

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false, { message: 'Incorrect username.' });

        const match = bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Incorrect password.' });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// Register
app.get('/register', (req, res) => {
    res.send(`
        <h2>Register</h2>
        <form method="post" action="/register">
            Username: <input name="username" /><br/>
            Password: <input name="password" type="password" /><br/>
            <button type="submit">Register</button>
        </form>
    `);
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hash });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.send('Error: Username already exists');
    }
});

// Login
app.get('/login', (req, res) => {
    res.send(`
        <h2>Login</h2>
        <form method="post">
            Username: <input name="username" /><br/>
            Password: <input name="password" type="password" /><br/>
            <button type="submit">Login</button>
        </form>
    `);
});

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/dashboard' })
);

// Protected dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send(`<h2>Dashboard</h2><p>Welcome, ${req.user.username}!</p><a href="/logout">Logout</a>`);
});

// Logout
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// Auth middleware
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
