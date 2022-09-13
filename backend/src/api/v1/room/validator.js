const mongoose = require('mongoose');
const { check, param } = require('express-validator');


exports.addRoomValidator = [
  check('title').trim().notEmpty().withMessage('Title is required'),

  check('price')
    .trim()
    .notEmpty()
    .withMessage('Price is required')
    .custom(async (price) => {
      if (price) {
        if (isNaN(price)) {
          throw "Price is must Numeric Value"
        }
      }
    }),
    check('maxPeople')
    .trim()
    .notEmpty()
    .withMessage('Max People is required')
    .custom(async (maxPeople) => {
      if (maxPeople) {
        if (isNaN(maxPeople)) {
          throw "Quantity is must Numeric Value"
        }
      }
    }),
    /* check('roomNumbers')
    .trim()
    .notEmpty()
    .withMessage('Room Numbers is required')
    .custom(async (roomNumbers) => {
      if (roomNumbers) {
        if (isNaN(roomNumbers)) {
          throw "Room Numbers is must Numeric Value"
        }
      }
    }) */
];

exports.updateRoomValidator = [
  check('price')
    .custom(async (price) => {
      if (price) {
        if (isNaN(price)) {
          throw "Price is must Numeric Value"
        }
      }
    }),
    check('maxPeople')
    .custom(async (maxPeople) => {
      if (maxPeople) {
        if (isNaN(maxPeople)) {
          throw "Quantity is must Numeric Value"
        }
      }
    }),
    /* check('roomNumbers')
    .custom(async (roomNumbers) => {
      if (roomNumbers) {
        if (isNaN(roomNumbers)) {
          throw "Quantity is must Numeric Value"
        }
      }
    }) */
];

exports.idValidator = [
  param('id').custom(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw 'No Room data found by the id';
    }
  }),
];
