const {
    addHotelService,
    updateHotelService,
    deleteHotelService,
    getHotelsService
  } = require('./service');
  
exports.addHotel = async (req, res) => {
    const { status, code, message, data } = await addHotelService({
      
      // _id:req.user._id,
      ...req.body,
    });
    res.status(code).json({ code, status, message, data  });
  };
  
  exports.updateHotel = async (req, res) => {
    const { status, code, message, data } = await updateHotelService({
      ...req.params,
      ...req.body,
    });

    res.status(code).json({ code, status, message, data });
  };
  
  exports.deleteHotel = async (req, res) => {
    const { status, code, message, data } = await deleteHotelService({
      ...req.params,
    });
    res.status(code).json({ code, status, message, data });
  };
  
  exports.getHotels = async (req, res) => {
    const { status, code, message, data } = await getHotelsService({});
    res.status(code).json({ code, status, message, data });
  };

  