const mongoose = require("mongoose")
const {School} = require("../database")
const hostUrl = "mongodb://127.0.0.1:27017/SCIMUS"

mongoose.connect(hostUrl)
        .then(() => {
            console.log("mongodb connected")})
        .catch(err => console.error(err))

async function del() {
  await School.deleteMany({})
}

del()

School.insertMany([
    {school_id:1, name:"St Olave's Grammar School"},
    {school_id:2, name:"Newstead Wood School"}
])