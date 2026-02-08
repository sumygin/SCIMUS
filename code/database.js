const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  user_tag: { type: String, unique: true, required: true },
  school_id: { type: Number, ref: 'School', required: false },
  country: { type: String, required: false },
  study_stage: { type: Number, enum: [0, 1, 2] },
  username: { type: String, maxlength: 20 },
  full_name: String,
  email: String,
  password_hash: String,
  scroll_data: { type: [Number], default: [] },      
  preference_data: { type: [Number], default: [] }, 
  created_at: { type: Date, default: Date.now },
  completed_today: Number,
  completed_total: Number,
  studied_today: Number,
  studied_total: Number,
  created_today: Number,
  created_total: Number, 
  average_like_rating: Number
});

const subjectSchema = new mongoose.Schema({
  subject_id: { type: Number, unique: true },
  study_stage: { type: Number, enum: [0, 1, 2] },
  full_name: {type:String},
  name: String,
  colour: String,
  papers: Number,
  exam_board: String,
  formulas: String,
  spec: String,
});

const subjectUserSchema = new mongoose.Schema({
  user_tag: { type: String, ref: 'User', required: true },
  subject_id: { type: Number, ref: 'Subject', required: true }
}, {
  _id: false
})

const topicSchema = new mongoose.Schema({
  topic_id: { type: Number, unique: true },
  subject_id: { type: Number, ref: 'Subject' },
  name: { type: String, maxlength: 35 }
});

const schoolSchema = new mongoose.Schema({
  school_id: { type: Number, unique: true },
  name: String
});

const questionSchema = new mongoose.Schema({
  question_id: { type: Number, unique: true },
  topic_id: { type: Number, ref: 'Topic', required: true },
  user_tag: { type: String, ref: 'User'},
  name: { type: String, maxlength: 40 },
  content: {type:String, required:true},
  avg_rating: {type: Number, default:0},
  like_rating: {type: Number, default:0},
  images: {type: [Buffer], default: []},
  paper_num: {type: Number, default:0},
  question_num: {type:Number,default:0},
  tag: {type: Number, enum: [0, 1, 2]}, //0=official, 1 = user-made, 2 = looking for solution
  scroll_data: {type: [Number], default: [] },
  mark_scheme: {type:String, required:true},
  created_at: {type: Date, default: Date.now},
  published: { type: Boolean, default: false},
  views: {type:Number, default:0},
})

const collectionSchema = new mongoose.Schema({
  collection_id: { type: Number, unique: true },
  user_tag: { type: String, ref: 'User', required: true },
  name: { type: String, maxlength: 40 },
  tag: { type: Number, enum: [0, 1] },
  paper_num: Number,
  created_at: { type: Date, default: Date.now },
  published: { type: Boolean, default: false }
})

const questionCollectionSchema = new mongoose.Schema({
  question_id: { type: Number, ref: 'Question', required: true },
  collection_id: { type: Number, ref: 'Collection', required: true }
}, {
  _id: false
})

const likeSchema = new mongoose.Schema({
  user_tag: { type: String, ref: 'User', required: true },
  item_id: { type: Number, required: true },
  item_type: { type: Number, enum: [0, 1] }, //0 = question, 1 = comment
  value: { type: Number, enum: [1, -1] }, 
  created_at: { type: Date, default: Date.now }
}, {
  _id: false
})

const rateSchema = new mongoose.Schema({
  user_tag: {type:String, ref:"User", required:true},
  question_id:{type:Number, required:true},
  value: {type:Number, enum:[1, 2, 3, 4, 5]},
  created_at: {type:Date, default:Date.now}
},
{_id:false})

const solveSchema = new mongoose.Schema({
  question_id: { type: Number, ref: 'Question', required: true },
  user_tag: { type: String, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
}, {
  _id: false
})

const watchSchema = new mongoose.Schema({
  question_id: { type: Number, ref: 'Question', required: true },
  user_tag: { type: String, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
}, {
  _id: false
})

const commentSchema = new mongoose.Schema({
  comment_id: { type: Number, unique: true },
  parent_comment_id: { type: Number, ref: 'Comment', required: false },
  question_id: { type: Number, ref: 'Question', required: true },
  user_tag: { type: String, ref: 'User', required: true },
  content: { type: String, maxlength: 200 },
  like_rating: {type:Number, default:0},
  created_at: { type: Date, default: Date.now }
})

const notificationSchema = new mongoose.Schema({
  notif_id: { type: Number, unique: true },
  user_id: { type: String, ref: 'User', required: true },
  question_id: { type: Number, ref: 'Question', required: false },
  message: String,
  viewed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
})

module.exports = {
    User: mongoose.model('User', userSchema),
    Subject: mongoose.model('Subject', subjectSchema),
    Topic: mongoose.model('Topic', topicSchema),
    School: mongoose.model('School', schoolSchema),
    Question: mongoose.model('Question', questionSchema),
    Collection: mongoose.model('Collection', collectionSchema),
    QuestionCollection: mongoose.model('QuestionCollection', questionCollectionSchema),
    Like: mongoose.model('Like', likeSchema),
    Solve: mongoose.model('Solve', solveSchema),
    Watch: mongoose.model('Watch', watchSchema),
    Comment: mongoose.model('Comment', commentSchema),
    Notification: mongoose.model('Notification', notificationSchema),
    SubjectUser: mongoose.model("SubjectUser", subjectUserSchema),
    Rate: mongoose.model("Rate", rateSchema)
}
