const router = require('express').Router();
const {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategories,
} = require('../category/controller');
const {
  addCategoryValidator,
  updateCategoryValidator,
  idValidator,
} = require('../category/validator');
const validationResult = require('../validators');

router.post('/', addCategoryValidator, validationResult, addCategory);

router.patch(
  '/:id',
  idValidator,
  updateCategoryValidator,
  validationResult,
  updateCategory
);

router.delete('/:id', idValidator, validationResult, deleteCategory);

router.get('/', getCategories);

module.exports = router;
