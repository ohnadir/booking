const { Category } = require('../models');
// const shortid = require("shortid");
const slugify = require("slugify");

exports.addCategoryService = async ({ name, categoryImage, createdBy, _id, body }) => {
  const response = {
    code: 201,
    status: 'Success',
    message: 'Category added successfully',
  };

  try {
    const isNameExist = await Category.findOne({ name });
    if (isNameExist) {
      response.code = 422;
      response.status = 'Failed';
      response.message = 'Name already taken';
      return response;
    }

    const newCategory = new Category({
      name,
      slug: slugify(name),
      categoryImage,
      createdBy
    });

    await newCategory.save();
    response.data = newCategory
    return response;

  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.updateCategoryService = async ({
  id,
  name,
  slug,
  categoryImage
}) => {
  const response = {
    code: 200,
    status: 'Success',
    message: 'Category updated successfully',
    data: {},
  };

  try {
    const category = await Category.findOne({
      _id: id,
      isDelete: false,
    }).exec();
    if (!category) {
      response.code = 422;
      response.status = 'failed';
      response.message = 'No category data found';
      return response;
    }

    const isNameExist = await Category.findOne({ name });
    if (
      isNameExist &&
      name === isNameExist.name &&
      String(category._id) !== String(isNameExist._id)
    ) {
      response.code = 422;
      response.status = 'Failed';
      response.message = 'Name already taken';
      return response;
    }

    category.name = name ? name : category.name;
    category.slug = slug ? slug : category.slug;
    category.categoryImage = categoryImage ? categoryImage : category.categoryImage;

    await category.save();

    response.data.category = category;
    return response;
    
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.deleteCategoryService = async ({ id }) => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Delete category successfully',
  };

  try {
    const category = await Category.findOne({
      _id: id,
      isDelete: false,
    });
    if (!category) {
      response.code = 404;
      response.status = 'failed';
      response.message = 'No category data found';
      return response;
    }

    category.isDelete = true;
    category.deletedAt = Date.now();
    await category.save();

    return response;
  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};

exports.getCategoriesService = async () => {
  const response = {
    code: 200,
    status: 'success',
    message: 'Fetch category list successfully',
    data: {},
  };

  try {
  
    const categories = await Category.find({})

    if (categories.length === 0) {
      response.code = 404;
      response.status = 'Failed';
      response.message = 'No Category data found';
      return response;
    }

    response.data.categories = categories;
    return response;

  } catch (error) {
    response.code = 500;
    response.status = 'failed';
    response.message = 'Error. Try again';
    return response;
  }
};
