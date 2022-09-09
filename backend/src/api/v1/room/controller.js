const {
  addRoomService,
  updateRoomService,
  deleteRoomService,
  getRoomsService,
  searchRoomService,
  getRoomService,
  filterRoomService,
  createRoomReview,
  deleteReviewService
} = require('./service');

exports.addRoom = async (req, res) => {
  const { status, code, message } = await addRoomService({
    // _id:req.user._id,
    ...req.body,
  });
  res.status(code).json({ code, status, message });
};

exports.updateRoom = async (req, res) => {
  const { status, code, message, data } = await updateRoomService({
    ...req.params,
    ...req.body,
  });
  if (data.room) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.deleteRoom = async (req, res) => {
  const { status, code, message, data } = await deleteRoomService({
    ...req.params,
  });
  res.status(code).json({ code, status, message, data });
};

exports.getRooms = async (req, res) => {
  const { status, code, message, data } = await getRoomsService({
    ...req.query,
  });
  if (data.rooms) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.searchRoom = async (req, res) => {
  const { status, code, message, data } = await searchRoomService({
    ...req.query,
  });
  if (data.rooms && data.rooms.length > 0) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.getRoom = async (req, res) => {
  const { status, code, message, data } = await getRoomService({
    ...req.params,
  });
  if (data.room) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.filterRoom = async (req, res) => {
  const { status, code, message, data } = await filterRoomService({
    ...req.query,
  });
  if (data.rooms && data.rooms.length > 0) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.createRoomReview = async (req, res) => {
  const { status, code, message, data } = await createRoomReview({
    body: req.body,
    req
  });
  res.status(code).json({ code, status, message, data });
};

exports.deleteReview = async (req, res) => {
  const { status, code, message, data } = await deleteReviewService({
    id: req.query._id
  });
  res.status(code).json({ code, status, message, data });
};