const router = require('express').Router();
const {
  addBooking,
  updateBooking,
  deleteBooking,
  getBookings,
  searchBooking,
  getBooking,
  
} = require('../booking/controller');


const {
  addBookingValidator,
  updateBookingValidator,
  idValidator,
} = require('../booking/validator');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')
const validationResult = require('../validators');

router.post('/', addBookingValidator, validationResult, addBooking);

router.patch(
  '/:id',
  idValidator,
  updateBookingValidator,
  validationResult,
  updateBooking
);

router.delete('/:id', idValidator, validationResult, deleteBooking);

router.get('/', getBookings);

router.get('/search', searchBooking);

router.get('/:id', idValidator, validationResult, getBooking);

module.exports = router;
