const { Schema, model } = require('mongoose');
const mongoose = require("mongoose");


const hotelSchema = Schema(
    {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        slug: {
          type: String,
          unique: true,
        },
        type: {
          type: String,
        },
        hotelImage: { type: String },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin",
        },
      },
      { timestamps: true }
);

module.exports = model('Hotel', hotelSchema);