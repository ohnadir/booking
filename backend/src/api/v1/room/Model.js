const { Schema, model } = require('mongoose');
const mongoose = require("mongoose");


const roomSchema = Schema(
  {
    title: { 
      type: String, 
      required: true
    },
    price: { 
      type: String, 
      required: true
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    desc: { 
      type: String, 
      required: true
    },
    reviews: [
      { userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' } },
      {review: String}
    ],
    roomNumbers: [
      { 
        number: Number, 
        unavailableDates: {type: [Date]}
      }
    ],
    // category: { type: mongoose.Schema.Types.ObjectId, ref: 'startech'},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    updatedAt: Date,
    isDelete: { type: Boolean, default: false },
    deletedAt: Date
  },
  { timestamps: true }
);

module.exports = model('Room', roomSchema);
