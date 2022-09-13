const { Hotel } = require('../models');

exports.addHotelService = async ({ body }) => {
  const {name, type, city, address, distance, title, desc, cheapestPrice} = body;
  const response = {
    code: 201,
    status: 'Success',
    message: 'Hotel added successfully',
  };

  try {
    const isNameExist = await Hotel.findOne({ name });
    if (isNameExist) {
      response.code = 422;
      response.status = 'Failed';
      response.message = 'Name already taken';
      return response;
    }

    const newHotel = new Hotel({
      name,
      type,
      city,
      address,
      distance,
      title,
      desc,
      cheapestPrice
    });

    await newHotel.save();
    response.data = newHotel
    return response;

  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.updateHotelService = async ({
  id,
  name,
  slug,
  hotelImage
}) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Hotel updated successfully',
    data: {},
  };

  try {
    const hotel = await Hotel.findOne({
      _id: id,
      isDelete: false,
    }).exec();
    if (!hotel) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'No hotel data found';
      return response;
    }

    const isNameExist = await Hotel.findOne({ name });
    if (
      isNameExist &&
      name === isNameExist.name &&
      String(hotel._id) !== String(isNameExist._id)
    ) {
      response.code = 422;
      response.status = 'Failed';
      response.message = 'Name already taken';
      return response;
    }

    hotel.name = name ? name : hotel.name;
    hotel.slug = slug ? slug : hotel.slug;
    hotel.hotelImage = hotelImage ? hotelImage : hotel.hotelImage;

    await hotel.save();

    response.data.hotel = hotel;
    return response;
    
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.deleteHotelService = async ({ id }) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Delete hotel successfully',
  };

  try {
    const hotel = await Hotel.findOne({
      _id: id,
      isDelete: false,
    });
    if (!hotel) {
      response.code = 404;
      response.status = 'failed';
      response.message = 'No hotel data found';
      return response;
    }

    hotel.isDelete = true;
    hotel.deletedAt = Date.now();
    await hotel.save();

    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.getHotelsService = async () => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Fetch hotel list successfully',
    data: {},
  };

  try {
  
    const hotels = await Hotel.find({})

    if (hotels.length === 0) {
      response.code = 404;
      response.status = 'Failed';
      response.message = 'No Hotel data found';
      return response;
    }

    response.data.hotels = hotels;
    return response;

  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};
