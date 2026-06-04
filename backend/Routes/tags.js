const express = require('express');
const router = express.Router();
const { getAllTags, getTagById, deleteTag } = require('../Controllers/tagsController');

router.get('/', getAllTags);
router.get('/:id', getTagById);
router.delete('/:id', deleteTag);

module.exports = router;