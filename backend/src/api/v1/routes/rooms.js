const router = require('express').Router();
const {
    addRoom,
    updateRoom,
    deleteRoom,
    getRooms,
} = require('../room/service');
const {
  addRoomValidator,
  updateRoomValidator,
  idValidator,
} = require('../room/validator');
const validationResult = require('../validators');

router.post('/:id', addRoomValidator, validationResult, addRoom);

router.patch(
  '/:id',
  idValidator,
  updateRoomValidator,
  validationResult,
  updateRoom
);

router.delete('/:id', idValidator, validationResult, deleteRoom);

router.get('/', getRooms);

module.exports = router;
