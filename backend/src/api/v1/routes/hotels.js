const router = require('express').Router();
const {
  addHotel,
  updateHotel,
  deleteHotel,
  getHotels,
  searchHotel,
  getHotel,
  
} = require('../hotel/controller');


const {
  addHotelValidator,
  updateHotelValidator,
  idValidator,
} = require('../hotel/validator');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')
const validationResult = require('../validators');

router.post('/', addHotelValidator, validationResult, addHotel);

router.patch(
  '/:id',
  idValidator,
  updateHotelValidator,
  validationResult,
  updateHotel
);

router.delete('/:id', idValidator, validationResult, deleteHotel);

router.get('/', getHotels);

// router.get('/search', searchHotel);

router.get('/:id', idValidator, validationResult, getHotel);

module.exports = router;
