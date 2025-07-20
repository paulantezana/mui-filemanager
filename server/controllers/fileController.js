const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const basePath = path.join(__dirname, '..', 'uploads');

exports.listDirectory = (req, res) => {
  const dir = req.query.path || '';
  const targetPath = path.join(basePath, dir);

  fs.readdir(targetPath, { withFileTypes: true }, async (err, items) => {
    if (err) return res.status(500).send({ error: 'No se pudo leer la carpeta.' });

    try {
      const result = await Promise.all(
        items.map(async (item) => {
          const fullPath = path.join(targetPath, item.name);
          const stats = await fs.promises.stat(fullPath);

          return {
            id: item.name,
            name: item.name,
            type: item.isDirectory() ? 'folder' : 'file',
            size: item.isDirectory() ? null : stats.size,
            createdAt: stats.birthtime,
            updatedAt: stats.mtime,
            mimeType: item.isDirectory() ? null : mime.lookup(fullPath) || 'application/octet-stream',
            path: path.posix.join(dir, item.name) // <-- Agrega el path relativo
          };
        })
      );

      res.json(result);
    } catch (e) {
      res.status(500).send({ error: 'Error obteniendo metadatos.' });
    }
  });
};

exports.createFolder = (req, res) => {
  const { path: folderPath } = req.body;
  const fullPath = path.join(basePath, folderPath);

  fs.mkdir(fullPath, { recursive: true }, err => {
    if (err) return res.status(500).send({ error: 'Error creando carpeta.' });
    res.send({ success: true });
  });
};

exports.uploadFile = (req, res) => {
  const destPath = req.body.path || '';
  const file = req.file;
  const target = path.join(basePath, destPath, file.originalname);

  fs.rename(file.path, target, err => {
    if (err) return res.status(500).send({ error: 'Error moviendo archivo.' });
    res.send({ success: true, file: file.originalname });
  });
};

exports.downloadFile = (req, res) => {
  const filePath = req.query.path;
  const fullPath = path.join(basePath, filePath);

  res.download(fullPath, err => {
    if (err) res.status(404).send({ error: 'Archivo no encontrado' });
  });
};

exports.deletePath = (req, res) => {
  const { path: targetPath } = req.body;
  const fullPath = path.join(basePath, targetPath);

  fs.stat(fullPath, (err, stats) => {
    if (err) return res.status(404).send({ error: 'Ruta no encontrada.' });

    const delFn = stats.isDirectory() ? fs.rm : fs.unlink;
    const options = stats.isDirectory() ? { recursive: true, force: true } : undefined;

    delFn(fullPath, options, (err) => {
      if (err) return res.status(500).send({ error: 'Error eliminando.' });
      res.send({ success: true });
    });
  });
};

exports.renamePath = (req, res) => {
  const { oldPath, newName } = req.body;
  const oldFull = path.join(basePath, oldPath);
  const newFull = path.join(path.dirname(oldFull), newName);

  fs.rename(oldFull, newFull, (err) => {
    if (err) return res.status(500).send({ error: 'Error renombrando.' });
    res.send({ success: true });
  });
};
