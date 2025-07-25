const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');
const upload = multer({ dest: 'uploads/' });

// CRUD de archivos/carpetas
router.get('/', fileController.listDirectory);
router.get('/tree', fileController.listDirectoryTree);
router.post('/create-folder', fileController.createFolder);
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/download', fileController.downloadFile);
router.delete('/', fileController.deletePath);
router.put('/rename', fileController.renamePath);

module.exports = router;
