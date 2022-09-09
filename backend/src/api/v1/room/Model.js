const { Schema, model } = require('mongoose');
const mongoose = require("mongoose");


const roomSchema = Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { 
      type: String, 
      required: true, 
      unique: true 
    },
    desc: { type: String, required: true},
    price: { type: String, required: true},
    roomPictures: [],
    reviews: [
      { userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' } },
      {review: String}
    ],
    quantity: { type: Number },
    offer: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'startech'},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    updatedAt: Date,
    isDelete: { type: Boolean, default: false },
    deletedAt: Date,
    user: {
      type: mongoose.Schema.ObjectId,
      
    }
  },
  { timestamps: true }
);

module.exports = model('Room', roomSchema);
