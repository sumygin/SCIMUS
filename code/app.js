const express = require('express')

const app = express()
const PORT = 3000

routes = require('./routes')
routes(app)

// start server
app.listen(PORT, () => console.log(`Server running on ${PORT}`))