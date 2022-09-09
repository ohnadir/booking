const router = require('express').Router();
const {
    addRoom,
    updateRoom,
    deleteRoom,
    getCategories,
} = require('../room/controller');
const {
  addRoomValidator,
  updateRoomValidator,
  idValidator,
} = require('../room/validator');
const validationResult = require('../validators');

router.post('/', addRoomValidator, validationResult, addRoom);

router.patch(
  '/:id',
  idValidator,
  updateRoomValidator,
  validationResult,
  updateRoom
);

router.delete('/:id', idValidator, validationResult, deleteRoom);

router.get('/', getCategories);

module.exports = router;
