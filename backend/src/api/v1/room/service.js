const { Room, Hotel } = require('../models');
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const APIFeatures = require('../utils/APIFeatures')

exports.addRoom= catchAsyncErrors(async (req, res, next) => {
  const { title, price , maxPeople, desc, roomNumbers } = req.body;
  const hotelId = req.params.id;

  try {
    const isTitleExist   = await Room.findOne({ title });
    if (isTitleExist) {
      return next(new ErrorHandler('Title Already Taken', 422))
    }

    const room = new Room({
      title,
      price,
      maxPeople,
      desc,
      roomNumbers
    });
    
    await room.save();
    const hotel = await Hotel.findByIdAndUpdate(hotelId, {
      $push: { rooms: room._id },
    });
    await hotel.save();
    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Add Room Successfully",
      data: room
  })

  } catch (error) {
    return next(new ErrorHandler('Error. Try again', 500))
  }
});

exports.updateRoom = catchAsyncErrors(async (req, res, next) => {
    const { name, price, desc} = req.body;
    const id = req.params.id;
  try {
    const room = await Room.findOne({
      _id: id,
      isDelete: false,
    }).exec();
    if (!room) {
      return next(new ErrorHandler('No room data found', 422))
    }

    const isNameExist = await Room.findOne({ name });
    if (
      isNameExist &&
      name === isNameExist.name &&
      String(room._id) !== String(isNameExist._id)
    ) {
      return next(new ErrorHandler('Phone number already taken', 422))
    }

    room.name = name ? name : room.name;
    room.price = price ? price : room.price;
    room.desc = desc ? desc : room.desc;

    await room.save();

    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Room Update Successfully",
      data: room
  })
    
  } catch (error) {
    return next(new ErrorHandler('Error. Try again', 500))
  }
});

exports.deleteRoom = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  try {
    const room = await Room.findOne({
      _id: id,
      isDelete: false,
    });
    if (!room) {
      return next(new ErrorHandler('No room data found', 422))
    }

    room.isDelete = true;
    room.deletedAt = Date.now();
    await room.save();

    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Add Room Successfully",
      data: room
  })
  } catch (error) {
    return next(new ErrorHandler('Error. Try again', 500))
  }
});

exports.getRooms = catchAsyncErrors(async (req, res, next) => {
  const { page, size } = req.query;
  try {
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(size) || 10;

    const totalDocuments = await Room.countDocuments({
      isDelete: false,
    });
    const totalPage = Math.ceil(totalDocuments / limit);

    const rooms = await Room.find({ isDelete: false }).limit(10)
      /* .select('-__v -isDelete')
      .sort({ _id: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .lean(); */

    if (rooms.length === 0) {
      return next(new ErrorHandler('No room data found', 404))
    }

    const data = {
      rooms,
      currentPage: pageNumber,
      totalDocuments,
      totalPage,
    };

    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Fetch all Room Successfully",
      data: data
  })
  } catch (error) {
    return next(new ErrorHandler('Error. Try again', 500))
  }
});

exports.searchRoom = catchAsyncErrors(async (req, res, next) => {
  const q = req.query;

  try {
    let query = { isDelete: false };
    if (q !== 'undefined' || q !== undefined || q) {
      let regex = new RegExp(q, 'i');
      query = {
        ...query,
        $or: [{ name: regex }],
      };
    }

    const rooms = await Room.find(query)
      .select('-__v -isDelete')
      .sort({ _id: -1 });

    if (rooms.length === 0) {
      return next(new ErrorHandler('No Room Found', 404))
    }
    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Add Room Successfully",
      data: rooms
  })
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
});

exports.getRoom = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  try {
    const room = await Room.findOne({
      _id: id,
      isDelete: false,
    })
      .select('-__v -isDelete')
    if (!room) {
      return next(new ErrorHandler('No room Found', 404))
    }
    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Add Room Successfully",
      data: room
  })
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
});

exports.filterRoom = catchAsyncErrors(async (req, res, next) => {
  const q = req.query;

  try {

    const apiFeatures  = new APIFeatures( Room.find().select('-__v -isDelete'), q).filter()

    let rooms = await apiFeatures.query;
    let filteredRoomsCount = rooms.length;

    if (rooms.length === 0) {
      return next(new ErrorHandler('No Room Found', 404))
    }

    const data = {
      rooms:rooms,
      filteredRoomsCount:filteredRoomsCount
    };
    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Filter Room Successfully",
      data: data
  })

  } catch (error) {
    return next(new ErrorHandler('Error. Try again', 500))
  }
});

// Create new review   =>   /api/v1/review
exports.createRoomReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, roomId } = body;

  try {
    

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return next(new ErrorHandler('No data found by This is', 402))  
    }

    const isReviewed = room.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
      room.reviews.forEach(review => {
        if (review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      })

    } else {
      room.reviews.push(review);
      room.numOfReviews = room.reviews.length
    }
    room.ratings = room.reviews.reduce((acc, item) => item.rating + acc, 0) / room.reviews.length

    await room.save({ validateBeforeSave: false });

    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Create Review Successfully"
  })

  }
  catch (error) {
    return next(new ErrorHandler('Error. Try again', 500))
  }
});

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id
  const room = await Room.findById(id);

  if (!room) {
    return next(new ErrorHandler('No data found by this id ', 500))
  }
  const reviews = room.reviews.filter(review => review._id.toString() !== req.query.id.toString());
  await Room.findByIdAndUpdate(req.query.id, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  res.status(200).json({
    Success: true,
    statusCode:200,
    message:"Delete Room Successfully"
})
});