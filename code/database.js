const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  user_tag: { type: String, unique: true, required: true }, // primary key, unique, no spaces
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: false },
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: false },
  study_stage: { type: Number, enum: [0, 1, 2] }, // 0=GCSE,1=A-level,2=University+
  username: { type: String, maxlength: 20 },
  full_name: String,
  email: String,
  password_hash: String,
  scroll_data: { type: [Number], default: [] },      
  preference_data: { type: [Number], default: [] }, 
  created_at: { type: Date, default: Date.now },
  completed_today: Number,
  completed_total: Number,
  studied_today: Number,    // in seconds
  studied_total: Number,    // in seconds
  created_today: Number,
  created_total: Number,
  average_like_rating: Number
});


const subjectSchema = new mongoose.Schema({
  subject_id: { type: Number, unique: true },
  study_stage: { type: Number, enum: [0, 1, 2] },
  name: String,
  colour: String,
  papers: Number,
  exam_board: String,
  formulas: String,
  spec: String,
});


const topicSchema = new mongoose.Schema({
  topic_id: { type: Number, unique: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  name: { type: String, maxlength: 30 }
});


const schoolSchema = new mongoose.Schema({
  school_id: { type: Number, unique: true },
  name: String
});


const countrySchema = new mongoose.Schema({
  country_id: { type: Number, unique: true },
  name: String
});


const questionSchema = new mongoose.Schema({
  question_id: { type: Number, unique: true },
  topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: false },
  user_tag: { type: String, ref: 'User', required: true }, // author
  name: { type: String, maxlength: 40 },
  content: String,
  avg_rating: Number,
  num_ratings: Number,
  like_rating: Number,
  images: { type: [Buffer], default: [] }, // references to images
  paper_num: Number,
  question_num: Number,
  tag: { type: Number, enum: [0, 1, 2] }, // 0=official,1=user-made,2=looking-for-solution
  scroll_data: { type: [Number], default: [] },
  mark_scheme: String,
  created_at: { type: Date, default: Date.now },
  published: { type: Boolean, default: false }
})


const collectionSchema = new mongoose.Schema({
  collection_id: { type: Number, unique: true },
  user_tag: { type: String, ref: 'User', required: true }, // creator
  name: { type: String, maxlength: 40 },
  tag: { type: Number, enum: [0, 1] }, // 0=Past paper,1=User-made
  paper_num: Number,
  created_at: { type: Date, default: Date.now },
  published: { type: Boolean, default: false }
})


const questionCollectionSchema = new mongoose.Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  collection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true }
}, {
  _id: false
})


const likeSchema = new mongoose.Schema({
  user_tag: { type: String, ref: 'User', required: true },
  item_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // question/comment
  item_type: { type: Number, enum: [0, 1] }, // 0=question,1=comment
  value: { type: Number, enum: [1, -1] },    // 1=like, -1=dislike
  created_at: { type: Date, default: Date.now }
}, {
  _id: false
})


const solveSchema = new mongoose.Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  user_tag: { type: String, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
}, {
  _id: false
})

const watchSchema = new mongoose.Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  user_tag: { type: String, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
}, {
  _id: false
})


const commentSchema = new mongoose.Schema({
  comment_id: { type: Number, unique: true },
  parent_comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false },
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  user_tag: { type: String, ref: 'User', required: true },
  content: { type: String, maxlength: 200 },
  like_rating: Number,
  created_at: { type: Date, default: Date.now }
})


const notificationSchema = new mongoose.Schema({
  notif_id: { type: Number, unique: true },
  user_id: { type: String, ref: 'User', required: true },
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: false },
  message: String,
  viewed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
})


module.exports = {
    User: mongoose.model('User', userSchema),
    Subject: mongoose.model('Subject', subjectSchema),
    Topic: mongoose.model('Topic', topicSchema),
    School: mongoose.model('School', schoolSchema),
    Country: mongoose.model('Country', countrySchema),
    Question: mongoose.model('Question', questionSchema),
    Collection: mongoose.model('Collection', collectionSchema),
    QuestionCollection: mongoose.model('QuestionCollection', questionCollectionSchema),
    Like: mongoose.model('Like', likeSchema),
    Solve: mongoose.model('Solve', solveSchema),
    Watch: mongoose.model('Watch', watchSchema),
    Comment: mongoose.model('Comment', commentSchema),
    Notification: mongoose.model('Notification', notificationSchema)
}
