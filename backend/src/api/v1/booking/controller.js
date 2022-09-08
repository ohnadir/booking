const {
  addBookingService,
  updateBookingService,
  deleteBookingService,
  getBookingsService,
  searchBookingService,
  getBookingService,
  filterBookingService,
  createBookingReview,
  deleteReviewService
} = require('./service');

exports.addBooking = async (req, res) => {
  const { status, code, message } = await addBookingService({
    // _id:req.user._id,
    ...req.body,
  });
  res.status(code).json({ code, status, message });
};

exports.updateBooking = async (req, res) => {
  const { status, code, message, data } = await updateBookingService({
    ...req.params,
    ...req.body,
  });
  if (data.booking) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.deleteBooking = async (req, res) => {
  const { status, code, message, data } = await deleteBookingService({
    ...req.params,
  });
  res.status(code).json({ code, status, message, data });
};

exports.getBookings = async (req, res) => {
  const { status, code, message, data } = await getBookingsService({
    ...req.query,
  });
  if (data.bookings) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.searchBooking = async (req, res) => {
  const { status, code, message, data } = await searchBookingService({
    ...req.query,
  });
  if (data.bookings && data.bookings.length > 0) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.getBooking = async (req, res) => {
  const { status, code, message, data } = await getBookingService({
    ...req.params,
  });
  if (data.booking) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.filterBooking = async (req, res) => {
  const { status, code, message, data } = await filterBookingService({
    ...req.query,
  });
  if (data.bookings && data.bookings.length > 0) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.createBookingReview = async (req, res) => {
  const { status, code, message, data } = await createBookingReview({
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