const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String
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