const mongoose = require('mongoose');
const { check, param } = require('express-validator');

const validatePhone = require('../utils/validatePhone');
const validateEmail = require('../utils/validateEmail');

exports.addUserValidator = [
  check('firstName').trim().notEmpty().withMessage('First Name is required'),

  check('lastName').trim().notEmpty().withMessage('Last Name is required'),
  check('password').trim().notEmpty().withMessage('Password is required'),

  check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .custom(async (email) => {
      if (email && !validateEmail(email)) {
        throw 'Invalid email';
      }
    }),
  check('phone')
    .trim()
    .notEmpty().withMessage('Phone Number is required')
    .custom(async (phone) => {
      if (phone) {
        const invalidPhone = validatePhone(phone);
        if (invalidPhone) {
          throw invalidPhone;
        }
      }
    })
];

exports.updateUserValidator = [
  check('phone')
    .trim()
    .custom(async (phone) => {
      if (phone) {
        const invalidPhone = validatePhone(phone);
        if (invalidPhone) {
          throw invalidPhone;
        }
      }
    }),

  check('email')
    .trim()
    .custom(async (email) => {
      if (email && !validateEmail(email)) {
        throw 'Invalid email';
      }
    })
];

exports.idValidator = [
  param('id').custom(async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw 'No User found by the id';
    }
  }),
];
