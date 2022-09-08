const {
    newOrderService,
    myOrdersService,
    allOrdersService,
    updateOrdersService,
    deleteOrderService
} = require('../order/service')


exports.newOrder = async () => {
    const { status, code, message, data } = await newOrderService({
        // _id:req.user._id,
        ...req.body,
        body:req.body
      });
      res.status(code).json({ code, status, message, data });
}

exports.myOrders = async () => {
    const { status, code, message, data } = await myOrdersService({
        ...req.params
      });
      res.status(code).json({ code, status, message, data });
}

exports.allOrders = async () => {
    const { status, code, message, data } = await allOrdersService({});
    res.status(code).json({ code, status, message, data });
}


exports.updateOrder = async () => {
    const { status, code, message, data } = await updateOrdersService({
        ...req.params,
        body: req.body
    });
    res.status(code).json({ code, status, message, data });
}

exports.deleteOrder = async () => {
    const { status, code, message, data } = await deleteOrderService({
        ...req.params
    });
    res.status(code).json({ code, status, message, data });
}