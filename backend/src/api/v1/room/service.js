const { Room } = require('../models');
// const shortid = require("shortid");
const slugify = require("slugify");
const ErrorMiddleware = require('../middleware/errors')
const APIFeatures = require('../utils/APIFeatures')

exports.addRoomService = async ({ name,price,quantity,desc, roomPictures,category,  _id }) => {
  const response = {
    code: 201,
    status: 'Success',
    message: 'Room added successfully',
  };

  try {
    const isNameExist = await Room.findOne({ name });
    if (isNameExist) {
      response.code = 422;
      response.status = 'Failed';
      response.message = 'Name already taken';
      return response;
    }

    const newRoom = new Room({
      name,
      slug: slugify(name),
      price,
      quantity,
      desc,
      roomPictures,
      category,
      // createdBy: req.user._id,
    });
    await newRoom.save();
    return response;
    

  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.updateRoomService = async ({
  id,
  name,
  price,
  desc
}) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Room updated successfully',
    data: {},
  };

  try {
    const room = await Room.findOne({
      _id: id,
      isDelete: false,
    }).exec();
    if (!room) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'No room data found';
      return response;
    }

    const isNameExist = await Room.findOne({ name });
    if (
      isNameExist &&
      name === isNameExist.name &&
      String(room._id) !== String(isNameExist._id)
    ) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'Phone number already taken';
      return response;
    }

    room.name = name ? name : room.name;
    room.price = price ? price : room.price;
    room.desc = desc ? desc : room.desc;

    await room.save();

    response.data.room = room;
    return response;
    
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.deleteRoomService = async ({ id }) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Delete room successfully',
  };

  try {
    const room = await Room.findOne({
      _id: id,
      isDelete: false,
    });
    if (!room) {
      response.code = 404;
      response.status = 'failed';
      response.message = 'No room data found';
      return response;
    }

    room.isDelete = true;
    room.deletedAt = Date.now();
    await room.save();

    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.getRoomsService = async ({ page, size }) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Fetch room list successfully',
    data: {},
  };

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
      response.code = 404;
      response.status = 'Failed';
      response.message = 'No room data found';
      return response;
    }

    response.data = {
      rooms,
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

exports.searchRoomService = async ({ q }) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Room data found successfully',
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

    const rooms = await Room.find(query)
      .select('-__v -isDelete')
      .sort({ _id: -1 });

    if (rooms.length === 0) {
      response.code = 404;
      response.status = 'failed';
      response.message = 'No room data found';
    }
    response.data.rooms = rooms;
    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.getRoomService = async ({ id }) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Fetch deatiled room successfully',
    data: {},
  };

  try {
    const room = await Room.findOne({
      _id: id,
      isDelete: false,
    })
      .select('-__v -isDelete')
    if (!room) {
      response.code = 404;
      response.status = 'failed';
      response.message = 'No room found';
      return response;
    }
    response.data.room = room;
    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.filterRoomService = async ({ q }) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Room data found successfully',
    data: {},
  };

  try {

    const apiFeatures  = new APIFeatures( Room.find().select('-__v -isDelete'), q).filter()

    let rooms = await apiFeatures.query;
    let filteredRoomsCount = rooms.length;

    if (rooms.length === 0) {
      response.code = 404;
      response.status = 'Failed';
      response.message = 'No room data found';
    }

    response.data.rooms = rooms;
    response.data.filteredRoomsCount = filteredRoomsCount;
    return response;

  } catch (error) {

    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
    
  }
};

// Create new review   =>   /api/v1/review
exports.createRoomReview = async ({body, req}) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Review create Successfully'
  };


  try {
    const { rating, comment, roomId } = body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    }

    const room = await Room.findById(roomId);
    if (!room) {
      response.code = 402;
      response.status = 'Failed';
      response.message = 'No Data found by this ID';
      return response;    
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
  
  const room = await Room.findById(id);

  if (!room) {
    response.code = 402;
    response.status = 'Failed';
    response.message = 'No Data found by this ID';
    return response; 
  }
  const reviews = room.reviews.filter(review => review._id.toString() !== req.query.id.toString());
  await Room.findByIdAndUpdate(req.query.roomId, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

}