const express = require('express')

const app = express()

const routes = require('./routes')
routes(app)

const PORT = process.env.PORT || 3000

// start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/', (req, res) => {
    res.send('SCIMUS backend running')
})