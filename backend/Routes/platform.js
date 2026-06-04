const express = require('express');
const router = express.Router();
const { getAllPlatforms, getPlatformById, createPlatform, updatePlatform, deletePlatform } = require('../Controllers/platformController');

router.get('/', getAllPlatforms);
router.get('/:id', getPlatformById);
router.post('/', createPlatform);
router.put('/:id', updatePlatform);
router.delete('/:id', deletePlatform);

module.exports = router;