const { Booking } = require('../models');
// const shortid = require("shortid");
const slugify = require("slugify");
const ErrorMiddleware = require('../middleware/errors')
const APIFeatures = require('../utils/APIFeatures')

exports.addBookingService = async ({ name,price,quantity,desc, bookingPictures,category,  _id }) => {
  const response = {
    code: 201,
    status: 'Success',
    message: 'Booking added successfully',
  };

  try {
    const isNameExist = await Booking.findOne({ name });
    if (isNameExist) {
      response.code = 422;
      response.status = 'Failed';
      response.message = 'Name already taken';
      return response;
    }

    const newBooking = new Booking({
      name,
      slug: slugify(name),
      price,
      quantity,
      desc,
      bookingPictures,
      category,
      // createdBy: req.user._id,
    });
    await newBooking.save();
    return response;
    

  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.updateBookingService = async ({
  id,
  name,
  price,
  desc
}) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Booking updated successfully',
    data: {},
  };

  try {
    const booking = await Booking.findOne({
      _id: id,
      isDelete: false,
    }).exec();
    if (!booking) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'No booking data found';
      return response;
    }

    const isNameExist = await Booking.findOne({ name });
    if (
      isNameExist &&
      name === isNameExist.name &&
      String(booking._id) !== String(isNameExist._id)
    ) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'Phone number already taken';
      return response;
    }

    booking.name = name ? name : booking.name;
    booking.price = price ? price : booking.price;
    booking.desc = desc ? desc : booking.desc;

    await booking.save();

    response.data.booking = booking;
    return response;
    
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.deleteBookingService = async ({ id }) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Delete booking successfully',
  };

  try {
    const booking = await Booking.findOne({
      _id: id,
      isDelete: false,
    });
    if (!booking) {
      response.code = 404;
      response.status = 'failed';
      response.message = 'No booking data found';
      return response;
    }

    booking.isDelete = true;
    booking.deletedAt = Date.now();
    await booking.save();

    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.getBookingsService = async ({ page, size }) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Fetch booking list successfully',
    data: {},
  };

  try {
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(size) || 10;

    const totalDocuments = await Booking.countDocuments({
      isDelete: false,
    });
    const totalPage = Math.ceil(totalDocuments / limit);

    const bookings = await Booking.find({ isDelete: false }).limit(10)
      /* .select('-__v -isDelete')
      .sort({ _id: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .lean(); */

    if (bookings.length === 0) {
      response.code = 404;
      response.status = 'Failed';
      response.message = 'No booking data found';
      return response;
    }

    response.data = {
      bookings,
      currentPage: pageNumber,
      totalDocuments,
      totalPage,
    };

    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.searchBookingService = async ({ q }) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Booking data found successfully',
    data: {},
  };

  try {
    let query = { isDelete: false };
    if (q !== 'undefined' || q !== undefined || q) {
      let regex = new RegExp(q, 'i');
      query = {
        ...query,
        $or: [{ name: regex }],
      };
    }

    const bookings = await Booking.find(query)
      .select('-__v -isDelete')
      .sort({ _id: -1 });

    if (bookings.length === 0) {
      response.code = 404;
      response.status = 'failed';
      response.message = 'No booking data found';
    }
    response.data.bookings = bookings;
    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.getBookingService = async ({ id }) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Fetch deatiled booking successfully',
    data: {},
  };

  try {
    const booking = await Booking.findOne({
      _id: id,
      isDelete: false,
    })
      .select('-__v -isDelete')
    if (!booking) {
      response.code = 404;
      response.status = 'failed';
      response.message = 'No booking found';
      return response;
    }
    response.data.booking = booking;
    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.filterBookingService = async ({ q }) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Booking data found successfully',
    data: {},
  };

  try {

    const apiFeatures  = new APIFeatures( Booking.find().select('-__v -isDelete'), q).filter()

    let bookings = await apiFeatures.query;
    let filteredBookingsCount = bookings.length;

    if (bookings.length === 0) {
      response.code = 404;
      response.status = 'Failed';
      response.message = 'No booking data found';
    }

    response.data.bookings = bookings;
    response.data.filteredBookingsCount = filteredBookingsCount;
    return response;

  } catch (error) {

    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
    
  }
};

// Create new review   =>   /api/v1/review
exports.createBookingReview = async ({body, req}) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Review create Successfully'
  };


  try {
    const { rating, comment, bookingId } = body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      response.code = 402;
      response.status = 'Failed';
      response.message = 'No Data found by this ID';
      return response;    
    }

    const isReviewed = booking.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
      booking.reviews.forEach(review => {
        if (review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      })

    } else {
      booking.reviews.push(review);
      booking.numOfReviews = booking.reviews.length
    }
    booking.ratings = booking.reviews.reduce((acc, item) => item.rating + acc, 0) / booking.reviews.length

    await booking.save({ validateBeforeSave: false });

    return response;

  }
  catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
}

exports.deleteReviewService = async ({ id }) => {
  
  const booking = await Booking.findById(id);

  if (!booking) {
    response.code = 402;
    response.status = 'Failed';
    response.message = 'No Data found by this ID';
    return response; 
  }
  const reviews = booking.reviews.filter(review => review._id.toString() !== req.query.id.toString());
  await Booking.findByIdAndUpdate(req.query.bookingId, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

}