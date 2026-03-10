const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")
const JSONStream = require("JSONStream")

const {Question, Watch, Solve, Rate, Like, QuestionCollection, Comment} = require("../database")

const hostUrl = "mongodb://127.0.0.1:27017/SCIMUS"

mongoose.connect(hostUrl)
  .then(() => console.log("mongodb connected"))
  .catch(err => console.error(err))

async function del() {
  await Question.deleteMany({})
}

async function addQuestions() {
  await del()

  const filePath = path.join(__dirname, "new-questions.json")

  const stream = fs.createReadStream(filePath, { encoding: "utf8" })
  const parser = JSONStream.parse("*")

  let batch = []
  const BATCH_SIZE = 1000
  let total = 0

  stream.pipe(parser)

  parser.on("data", async (question) => {
    batch.push(question)

    if (batch.length >= BATCH_SIZE) {
      parser.pause()

      try {
        await Question.insertMany(batch)
        total += batch.length
        console.log("Inserted:", total)
        batch = []
      } catch (err) {
        console.error(err)
      }

      parser.resume()
    }
  })

  parser.on("end", async () => {
    if (batch.length > 0) {
      await Question.insertMany(batch)
      total += batch.length
    }

    await Question.updateMany({}, {$set: {user_tag: "admin"}})

    console.log("Inserted " + total + " questions.")

    await Watch.deleteMany({})
    await Solve.deleteMany({})
    await Rate.deleteMany({})
    await Like.deleteMany({})
    await Comment.deleteMany({})
    await QuestionCollection.deleteMany({})

    mongoose.connection.close()
  })

  parser.on("error", (err) => {
    console.error(err)
  })
}

addQuestions()