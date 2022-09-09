const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = Schema(
  {
    firstName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    lastName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      trim: true, 
      unique: true 
    },
    country: {
      type: String,
      required: true,
    },
    avatar: String,
    city: {
      type: String,
      required: true,
    },
    phone: { 
      type: String, 
      required: true, 
      trim: true, 
      unique: true
    },
    password: { 
      type: String, 
      required: true, 
      trim: true 
    },
    updatedBy: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isDelete: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);


userSchema.virtual('fullName').get(function () {
  return [this.firstName, this.lastName].filter(Boolean).join(' ');
});

// Encrypting Password before saving user 
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
})

// Compare user Password 
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}


// Return JWT Token 
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  })
}

//  Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000
  return resetToken;
}
  
  
  
module.exports = model('User', userSchema);
