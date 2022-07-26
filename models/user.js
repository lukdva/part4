const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Username not provided'],
      minLength: [3, 'Username too short']
    },
    passwordHash: {
      type: String,
      required: true
    },
    name: String,
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
      }
    ]
  })

  userSchema.set('toJSON', {
    transform: (doc, ret, options) => {
      ret.id = doc._id.toString();
      delete ret._id;
      delete ret.passwordHash;
      delete ret.__v;

    }
  })
 module.exports = mongoose.model('User', userSchema)