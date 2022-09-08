const mongoose = require('mongoose');
const { check, param } = require('express-validator');


exports.addProductValidator = [
  check('name').trim().notEmpty().withMessage('Name is required'),

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
    check('quantity')
    .trim()
    .notEmpty()
    .withMessage('Quantity is required')
    .custom(async (quantity) => {
      if (quantity) {
        if (isNaN(quantity)) {
          throw "Quantity is must Numeric Value"
        }
      }
    })
];

exports.updateProductValidator = [
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
    check('quantity')
    .custom(async (quantity) => {
      if (quantity) {
        if (isNaN(quantity)) {
          throw "Quantity is must Numeric Value"
        }
      }
    })
];

exports.idValidator = [
  param('id').custom(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw 'No Product data found by the id';
    }
  }),
];
