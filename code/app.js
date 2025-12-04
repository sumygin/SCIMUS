const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const routes = require('./routes')

const app = express()
const PORT = 3000

routes(app)

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
