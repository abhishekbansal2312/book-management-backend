const mongoose = require("mongoose");
const Club = require("./club");

const gradeSchema = new mongoose.Schema({
  course: {
    type: String,
  },
  score: {
    type: Number,
    min: 0,
  },
  maxScore: {
    type: Number,
  },
  date: {
    type: Date,
  },
});

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  locality: {
    type: String,
  },
  street: {
    type: String,
  },
});

const Profile = new mongoose.Schema({
  bio: {
    type: String,
  },
  contact: {
    type: String,
  },
  address: {
    type: [addressSchema],
    default: [],
  },
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      validate: {
        validator: (val) => val >= 0 && val <= 150,
        message: "Age must be between 0 and 150",
      },
    },
    grades: {
      type: [gradeSchema],
      default: [],
    },
    address: {
      type: [addressSchema],
      default: [],
    },
    profile: {
      type: Profile,
      default: {},
    },
    clubs: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.averageGrades = function () {
  if (this.grades.length === 0) {
    return 0;
  }
  const total = this.grades.reduce((acc, grade) => acc + grade.score, 0);
  return total / this.grades.length;
};

UserSchema.virtual("clubCounts").get(async function () {
  const clubs = await Club.find({ users: this._id });
  return clubs.length;
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
