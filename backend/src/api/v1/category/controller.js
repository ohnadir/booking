const {
    addCategoryService,
    updateCategoryService,
    deleteCategoryService,
    getCategoriesService
  } = require('./service');
  
exports.addCategory = async (req, res) => {
    const { status, code, message, data } = await addCategoryService({
      
      // _id:req.user._id,
      ...req.body,
    });
    res.status(code).json({ code, status, message, data  });
  };
  
  exports.updateCategory = async (req, res) => {
    const { status, code, message, data } = await updateCategoryService({
      ...req.params,
      ...req.body,
    });
    if (data.category) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };
  
  exports.deleteCategory = async (req, res) => {
    const { status, code, message, data } = await deleteCategoryService({
      ...req.params,
    });
    res.status(code).json({ code, status, message, data });
  };
  
  exports.getCategories = async (req, res) => {
    const { status, code, message, data } = await getCategoriesService({});
    
    if (data.categories) {
      return res.status(code).json({ code, status, message, data });
    }
    res.status(code).json({ code, status, message });
  };

  