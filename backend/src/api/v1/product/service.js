const { Product } = require('../models');
// const shortid = require("shortid");
const slugify = require("slugify");
const ErrorMiddleware = require('../middleware/errors')
const APIFeatures = require('../utils/APIFeatures')

exports.addProductService = async ({ name,price,quantity,desc, productPictures,category,  _id }) => {
  const response = {
    code: 201,
    status: 'Success',
    message: 'Product added successfully',
  };

  try {
    const isNameExist = await Product.findOne({ name });
    if (isNameExist) {
      response.code = 422;
      response.status = 'Failed';
      response.message = 'Name already taken';
      return response;
    }

    const newProduct = new Product({
      name,
      slug: slugify(name),
      price,
      quantity,
      desc,
      productPictures,
      category,
      // createdBy: req.user._id,
    });
    await newProduct.save();
    return response;
    

  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.updateProductService = async ({
  id,
  name,
  price,
  desc
}) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Product updated successfully',
    data: {},
  };

  try {
    const product = await Product.findOne({
      _id: id,
      isDelete: false,
    }).exec();
    if (!product) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'No product data found';
      return response;
    }

    const isNameExist = await Product.findOne({ name });
    if (
      isNameExist &&
      name === isNameExist.name &&
      String(product._id) !== String(isNameExist._id)
    ) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'Phone number already taken';
      return response;
    }

    product.name = name ? name : product.name;
    product.price = price ? price : product.price;
    product.desc = desc ? desc : product.desc;

    await product.save();

    response.data.product = product;
    return response;
    
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.deleteProductService = async ({ id }) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Delete product successfully',
  };

  try {
    const product = await Product.findOne({
      _id: id,
      isDelete: false,
    });
    if (!product) {
      response.code = 404;
      response.status = 'failed';
      response.message = 'No product data found';
      return response;
    }

    product.isDelete = true;
    product.deletedAt = Date.now();
    await product.save();

    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.getProductsService = async ({ page, size }) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Fetch product list successfully',
    data: {},
  };

  try {
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(size) || 10;

    const totalDocuments = await Product.countDocuments({
      isDelete: false,
    });
    const totalPage = Math.ceil(totalDocuments / limit);

    const products = await Product.find({ isDelete: false }).limit(10)
      /* .select('-__v -isDelete')
      .sort({ _id: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .lean(); */

    if (products.length === 0) {
      response.code = 404;
      response.status = 'Failed';
      response.message = 'No product data found';
      return response;
    }

    response.data = {
      products,
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

exports.searchProductService = async ({ q }) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Product data found successfully',
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

    const products = await Product.find(query)
      .select('-__v -isDelete')
      .sort({ _id: -1 });

    if (products.length === 0) {
      response.code = 404;
      response.status = 'failed';
      response.message = 'No product data found';
    }
    response.data.products = products;
    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.getProductService = async ({ id }) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Fetch deatiled product successfully',
    data: {},
  };

  try {
    const product = await Product.findOne({
      _id: id,
      isDelete: false,
    })
      .select('-__v -isDelete')
    if (!product) {
      response.code = 404;
      response.status = 'failed';
      response.message = 'No product found';
      return response;
    }
    response.data.product = product;
    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.filterProductService = async ({ q }) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Product data found successfully',
    data: {},
  };

  try {

    const apiFeatures  = new APIFeatures( Product.find().select('-__v -isDelete'), q).filter()

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    if (products.length === 0) {
      response.code = 404;
      response.status = 'Failed';
      response.message = 'No product data found';
    }

    response.data.products = products;
    response.data.filteredProductsCount = filteredProductsCount;
    return response;

  } catch (error) {

    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
    
  }
};

// Create new review   =>   /api/v1/review
exports.createProductReview = async ({body, req}) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Review create Successfully'
  };


  try {
    const { rating, comment, productId } = body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    }

    const product = await Product.findById(productId);
    if (!product) {
      response.code = 402;
      response.status = 'Failed';
      response.message = 'No Data found by this ID';
      return response;    
    }

    const isReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
      product.reviews.forEach(review => {
        if (review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      })

    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length
    }
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

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
  
  const product = await Product.findById(id);

  if (!product) {
    response.code = 402;
    response.status = 'Failed';
    response.message = 'No Data found by this ID';
    return response; 
  }
  const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

}