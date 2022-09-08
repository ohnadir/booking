const { Schema, model } = require('mongoose');
const mongoose = require("mongoose");


const categorySchema = Schema(
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
        categoryImage: { type: String },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin",
        },
      },
      { timestamps: true }
);

module.exports = model('category', categorySchema);