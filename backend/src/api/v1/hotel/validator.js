const mongoose = require('mongoose');
const { check, param } = require('express-validator');


exports.addHotelValidator = [
  check('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required'),

  check('type')
  .trim()
  .notEmpty()
  .withMessage('Type is required'),

  check('city')
  .trim()
  .notEmpty()
  .withMessage('City is required'),

  check('address')
  .trim()
  .notEmpty()
  .withMessage('Address is required'),

  check('distance')
  .trim()
  .notEmpty()
  .withMessage('Distance is required'),

  check('title')
  .trim()
  .notEmpty()
  .withMessage('Title is required'),

  check('rating')
  .custom(async (rating) => {
    if (rating) {
      if(rating < 0){
        throw "Rating is must positive Value"
      }
      if(rating > 5){
        throw "The highest rating value is 5"
      }
      if (isNaN(rating)) {
        throw "Rating is must Numeric Value"
      }
    }
  }),

  check('cheapestPrice')
  .custom(async (cheapestPrice) => {
    if (cheapestPrice) {
      if (isNaN(cheapestPrice)) {
        throw "Cheapest Price is must Numeric Value"
      }
    }
  })

  
];

exports.updateHotelValidator = [
  check('rating')
  .custom(async (rating) => {
    if (rating) {
      if(rating < 0){
        throw "Rating is must positive Value"
      }
      if(rating > 5){
        throw "The highest rating value is 5"
      }
      if (isNaN(rating)) {
        throw "Rating is must Numeric Value"
      }
    }
  }),

  check('cheapestPrice')
  .custom(async (cheapestPrice) => {
    if (cheapestPrice) {
      if (isNaN(cheapestPrice)) {
        throw "Cheapest Price is must Numeric Value"
      }
    }
  })
];

exports.idValidator = [
  param('id').custom(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw 'No Hotel data found by the id';
    }
  }),
];
