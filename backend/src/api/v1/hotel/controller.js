const { Hotel } = require('../models');
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

exports.addHotel = catchAsyncErrors(async (req, res, next) => {
  const {name, type, city, address, distance, title, desc, cheapestPrice} = req.body;

  try {
    const isNameExist = await Hotel.findOne({ name });
    if (isNameExist) {
      return next(new ErrorHandler('Name Already Taken', 422))
    }

    const hotel = new Hotel({
      name, type, city, address, distance,
      title, desc, cheapestPrice
    });

    await hotel.save();
    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Add Hotel Successfully",
      data: hotel
    })

  } catch (error) {
    return next(new ErrorHandler('Error. Try Again', 500))
  }
});

exports.updateHotel = catchAsyncErrors(async (req, res, next)=> {
  const {  name, city, address, 
    distance, photos, title, desc, 
    rating, rooms, cheapestPrice, featured} = req.body;
  const id = req.params.id;

  try {
    const hotel = await Hotel.findOne({
      _id: id,
      isDelete: false,
    }).exec();
    if (!hotel) {
      return next(new ErrorHandler('No Hotel Data', 422))
    }

    const isNameExist = await Hotel.findOne({ name });
    if (
      isNameExist &&
      name === isNameExist.name &&
      String(hotel._id) !== String(isNameExist._id)
    ) {
      return next(new ErrorHandler('Name Already Taken', 422))
    }

    hotel.name = name ? name : hotel.name;
    hotel.slug = slug ? slug : hotel.slug;
    hotel.hotelImage = hotelImage ? hotelImage : hotel.hotelImage;

    await hotel.save();

    response.data.hotel = hotel;
    return response;
    
  } catch (error) {
    return next(new ErrorHandler('Error. Try again', 500))
  }
});

exports.deleteHotel = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  try {
    const hotel = await Hotel.findOne({
      _id: id,
      isDelete: false,
    });
    if (!hotel) {
      return next(new ErrorHandler('No Hotel Found', 404))
    }

    hotel.isDelete = true;
    hotel.deletedAt = Date.now();
    await hotel.save();

    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Delete Hotel Successfully",
      data: hotel
    })
  } catch (error) {
    return next(new ErrorHandler('Error. Try Again', 500))
  }
});

exports.getHotels = catchAsyncErrors(async (req, res, next) => {
  try {
    const hotels = await Hotel.find({})

    if (hotels.length === 0) {
      return next(new ErrorHandler('No Hotel Found', 404))
    }
    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Add Room Successfully",
      data: {hotels}
    })

  } catch (error) {
    return next(new ErrorHandler('Error. Try Again', 422))
  }
});
exports.getHotel = catchAsyncErrors(async (req, res, next) => {
  const id= req.params.id;
  try {
    const hotels = await Hotel.find({id})

    if (!hotels) {
      return next(new ErrorHandler('No Hotel Found', 404))
    }
    res.status(200).json({
      Success: true,
      statusCode:200,
      message:"Hotel Details get Successfully",
      data: {hotels}
    })

  } catch (error) {
    return next(new ErrorHandler('Error. Try Again', 422))
  }
});