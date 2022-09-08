const Order = require('../order/Model');
const Product = require('../product/Model');

exports.newOrderService = async ({ body }) => {
    const response = {
      code: 201,
      status: 'Success',
      message: 'Order successfully',
    };
    
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = body;


    try {
        const order = await Order.create({
            orderItems,
            shippingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paidAt: Date.now(),
            user: req.user._id
        });

    await order.save();
    return response;
        
    } catch (error) {
      response.code = 500;
      response.status = 'failed';
      response.message = 'Error. Try again';
      return response;
    }
};

// Get logged in user orders   =>   /api/v1/orders
exports.myOrdersService = async ({ id }) => {
    
    const response = {
        code: 201,
        status: 'Success',
        message: 'Get user wise Order successfully',
    };
    try {
        const orders = await Order.find({ _id: id })

        if (!orders) {
            response.code = 500;
            response.status = 'Failed';
            response.message = 'Can not get Order by this ID';
            return response;
        }
        response.data.orders = orders;
        return response;
    }
    catch (error) {
        response.code = 500;
        response.status = 'failed';
        response.message = 'Error. Try again';
        return response;
    }
}

// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrdersService = async () => {
    const response = {
        code: 201,
        status: 'Success',
        message: 'Get All Order successfully',
    };
    try {
        const orders = await Order.find()

        if (orders.length == 0) {
            response.code = 500;
            response.status = 'Failed';
            response.message = 'No Found order';
            return response;
        }

        let totalAmount = 0;
        orders.forEach(order => {
            totalAmount += order.totalPrice
        })

        response.data.orders = orders;
        response.data.totalAmount = totalAmount;
        return response;
    }
    catch (error) {
        response.code = 500;
        response.status = 'Failed';
        response.message = 'Error. Try again';
        return response;
    }
}

// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
exports.updateOrdersService = async ({ id, body }) => {

    const response = {
        code: 201,
        status: 'Success',
        message: 'Update Order successfully',
    };    

    try {
        const order = await Order.findById({ _id: id })

        if (!order) {
            response.code = 500;
            response.status = 'Failed';
            response.message = 'Can not get Order by this ID';
            return response;
        }

        if (order.orderStatus === 'Delivered') {
            response.code = 400;
            response.status = 'Failed';
            response.message = 'You have already delivered this order';
            return response;
        }

        order.orderItems.forEach(async item => {
            await updateStock(item.product, item.quantity)
        })
    
        order.orderStatus = body.status
        order.deliveredAt = Date.now()
    
        await order.save()
    }
    catch (error) {
        response.code = 500;
        response.status = 'Failed';
        response.message = 'Error. Try again';
        return response;
    }
}

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false })
}


// Delete order   =>   /api/v1/admin/order/:id
exports.deleteOrderService = async ({ id }) => {
    const response = {
        code: 201,
        status: 'Success',
        message: ' Delete Order successfully ',
    }; 

    try {
        const product = await Order.findByIdAndDelete({ _id: id })

        if (!product) {
            response.code = 500;
            response.status = 'Failed';
            response.message = 'Can not get Order by this ID';
            return response;
        }
        return response;
    }
    catch (error) {
        response.code = 500;
        response.status = 'Failed';
        response.message = 'Error. Try again';
        return response;
    }
}