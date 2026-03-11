const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  user_tag: { type: String, unique: true, required: true, index: true },
  school_id: { type: Number, ref: 'School', required: false, index: true },
  country: { type: String, required: false },
  study_stage: { type: Number, enum: [0, 1, 2], index: true },
  username: { type: String, maxlength: 20, index: true },
  full_name: String,
  email: { type: String, index: true },
  password_hash: String,
  preference_data: { type: [Number], default: [] }, 
  created_at: { type: Date, default: Date.now },
  completed_today: Number,
  completed_total: Number,
  studied_today: Number,
  studied_total: Number,
  created_today: Number,
  created_total: Number, 
  total_likes:Number,
  likes_today:Number,
  interaction_n:{type:Number, default:0},
});

const subjectSchema = new mongoose.Schema({
  subject_id: { type: Number, unique: true, index: true },
  study_stage: { type: Number, enum: [0, 1, 2] },
  full_name: {type:String},
  name: String,
  colour: String,
  papers: Number,
  exam_board: String,
  formulas: String,
  spec: String,
  weights:{type:[Number], default:[1, 1, 1, 1, 1, 1, -1, 1, 1]}
});
subjectSchema.index({ full_name: 1, study_stage: 1 }, { unique: true });

const subjectUserSchema = new mongoose.Schema({
  user_tag: { type: String, ref: 'User', required: true, index: true },
  subject_id: { type: Number, ref: 'Subject', required: true, index: true },
  ability:  {type:Number, default:0},
});
subjectUserSchema.index({ user_tag: 1, subject_id: 1 }, { unique: true });

const topicSchema = new mongoose.Schema({
  topic_id: { type: Number, unique: true, index: true },
  subject_id: { type: Number, ref: 'Subject', index: true },
  name: { type: String, maxlength: 35 }
});
topicSchema.index({ subject_id: 1, name: 1 }, { unique: true });

const schoolSchema = new mongoose.Schema({
  school_id: { type: Number, unique: true, index: true },
  name: String
});

const questionSchema = new mongoose.Schema({
  question_id: { type: Number, unique: true, index: true },
  topic_id: { type: Number, ref: 'Topic', required: true, index: true },
  user_tag: { type: String, ref: 'User', index: true },
  name: { type: String, maxlength: 40 },
  content: {type:String, required:true},
  total_diff_rating: {type: Number, default:0},
  avg_diff_rating: {type: Number, default:0},
  like_rating: {type: Number, default:0},
  images: {type: [String], default: []},
  paper_num: {type: Number, default:0},
  question_num: {type:Number,default:0},
  tag: {type: Number, enum: [0, 1, 2], index: true }, //0=official, 1 = user-made, 2 = looking for solution
  mark_scheme: {type:String, required:true},
  created_at: {type: Date, default: Date.now},
  published: { type: Boolean, default: false, index: true },
  views: {type:Number, default:0},
  year: {type:Number, default:0},
  num_comments: {type:Number, default:0},
  num_collections: {type:Number, default:0},
  num_watches: {type:Number, default:0},
  num_solves:{type:Number, default:0},
  num_diff_ratings: {type: Number,  default:0},
  study_stage:{type:Number, required:true, index: true},
  subject_id:{type:Number, required:true, index: true},
  difficulty:{type:Number, default:0, index: true},
  interaction_n:{type:Number, default:0},
});

const collectionSchema = new mongoose.Schema({
  collection_id: { type: Number, unique: true, index: true },
  user_tag: { type: String, ref: 'User', required: true, index: true },
  name: { type: String, maxlength: 40 },
  tag: { type: Number, enum: [0, 1], index: true }, //0 = past paper, 1 = user-made
  created_at: { type: Date, default: Date.now },
  published: { type: Boolean, default: false, index: true },
  subject_ids: { type: [Number], ref: 'Subject',  default:[], index: true },
  topic_ids: { type: [Number], ref: 'Topic',  default:[], index: true },
  stages: { type: [Number],  default:[], index: true },
  paper:{type:Number, default:0},
  year:{type:Number, default:0},
  question_num:{type:Number, default:0},
  preview:{type:[String], default:[]}
});

const questionCollectionSchema = new mongoose.Schema({
  question_id: { type: Number, ref: 'Question', required: true, index: true },
  collection_id: { type: Number, ref: 'Collection', required: true, index: true }
});

const likeSchema = new mongoose.Schema({
  user_tag: { type: String, ref: 'User', required: true, index: true },
  item_id: { type: Number, required: true, index: true },
  item_type: { type: Number, enum: [0, 1] }, //0 = question, 1 = comment
  value: { type: Number, enum: [1, -1] }, 
  created_at: { type: Date, default: Date.now, index: true }
});

const rateSchema = new mongoose.Schema({
  user_tag: {type:String, ref:"User", required:true, index: true},
  question_id:{type:Number, required:true, index: true},
  value: {type:Number, enum:[1, 2, 3, 4, 5]},
  created_at: {type:Date, default:Date.now, index: true}
});

const solveSchema = new mongoose.Schema({
  question_id: { type: Number, ref: 'Question', required: true, index: true },
  user_tag: { type: String, ref: 'User', required: true, index: true },
  created_at: { type: Date, default: Date.now }
});

const watchSchema = new mongoose.Schema({
  question_id: { type: Number, ref: 'Question', required: true, index: true },
  user_tag: { type: String, ref: 'User', required: true, index: true },
  created_at: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  comment_id: { type: Number, unique: true, index: true },
  parent_comment_id: { type: Number, ref: 'Comment', required: false, index: true },
  question_id: { type: Number, ref: 'Question', required: true, index: true },
  user_tag: { type: String, ref: 'User', required: true, index: true },
  content: { type: String, maxlength: 200 },
  like_rating: {type:Number, default:0},
  created_at: { type: Date, default: Date.now, index: true }
});

const notificationSchema = new mongoose.Schema({
  notif_id: { type: Number, unique: true, index: true },
  user_tag: { type: String, ref: 'User', required: true, index: true },
  question_id: { type: Number, ref: 'Question', required: false, index: true },
  message: String,
  viewed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now, index: true }
});

const dataSchema = new mongoose.Schema({
  time: Date
});

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
    Rate: mongoose.model("Rate", rateSchema),
    ServerData: mongoose.model("ServerData", dataSchema)
}