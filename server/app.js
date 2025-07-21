const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/files', fileRoutes);
app.use('/uploads', express.static('uploads')); // Acceso público

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
