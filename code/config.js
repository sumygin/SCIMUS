const crypto = require("crypto")

const PRODUCTION = process.env.NODE_ENV == "production" || !!process.env.RENDER

let sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
    //never fall back to a guessable secret - sessions just won't survive a restart
    sessionSecret = crypto.randomBytes(32).toString("hex")
    if (PRODUCTION) {
        console.warn("SESSION_SECRET is not set, using a temporary one. Users will be logged out on every restart.")
    }
}

module.exports = {
    PRODUCTION,
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/SCIMUS",
    MODEL_URL: process.env.MODEL_URL || "http://127.0.0.1:8000",
    MODEL_KEY: process.env.MODEL_KEY || "",
    //the model runs as its own service in production, locally node starts it
    START_MODEL: !PRODUCTION && !process.env.MODEL_URL,
    SESSION_SECRET: sessionSecret,
}
