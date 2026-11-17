const mongoose = require("mongoose")

const hostUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/SCIMUS"

//the insert scripts wipe collections before filling them, so a remote database has to be confirmed
module.exports = async function connect() {
    const local = hostUrl.includes("127.0.0.1") || hostUrl.includes("localhost")

    if (!local && process.env.SEED_CONFIRM != "yes") {
        console.error("Not seeding a remote database. Run again with SEED_CONFIRM=yes if this is on purpose.")
        process.exit(1)
    }

    await mongoose.connect(hostUrl)
    console.log("mongodb connected")
}
