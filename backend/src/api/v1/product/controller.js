const {
  addProductService,
  updateProductService,
  deleteProductService,
  getProductsService,
  searchProductService,
  getProductService,
  filterProductService,
  createProductReview,
  deleteReviewService
} = require('./service');

exports.addProduct = async (req, res) => {
  const { status, code, message } = await addProductService({
    // _id:req.user._id,
    ...req.body,
  });
  res.status(code).json({ code, status, message });
};

exports.updateProduct = async (req, res) => {
  const { status, code, message, data } = await updateProductService({
    ...req.params,
    ...req.body,
  });
  if (data.product) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.deleteProduct = async (req, res) => {
  const { status, code, message, data } = await deleteProductService({
    ...req.params,
  });
  res.status(code).json({ code, status, message, data });
};

exports.getProducts = async (req, res) => {
  const { status, code, message, data } = await getProductsService({
    ...req.query,
  });
  if (data.products) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.searchProduct = async (req, res) => {
  const { status, code, message, data } = await searchProductService({
    ...req.query,
  });
  if (data.products && data.products.length > 0) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.getProduct = async (req, res) => {
  const { status, code, message, data } = await getProductService({
    ...req.params,
  });
  if (data.product) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.filterProduct = async (req, res) => {
  const { status, code, message, data } = await filterProductService({
    ...req.query,
  });
  if (data.products && data.products.length > 0) {
    return res.status(code).json({ code, status, message, data });
  }
  res.status(code).json({ code, status, message });
};

exports.createProductReview = async (req, res) => {
  const { status, code, message, data } = await createProductReview({
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