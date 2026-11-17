const mongoose = require("mongoose")
const {School} = require("../database")
const connect = require("./connect")

async function seed() {
    await connect()

    await School.deleteMany({})
    await School.insertMany([
        {school_id:1, name:"St Olave's Grammar School"},
        {school_id:2, name:"Newstead Wood School"}
    ])

    console.log("done")
    await mongoose.disconnect()
}

seed()
