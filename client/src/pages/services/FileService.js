class FileService {
  constructor(baseURL = 'http://localhost:5000/api/files') {
    this.baseURL = baseURL;
  }

  // 🔍 1. Listar archivos y carpetas
  async list(path = '') {
    const res = await fetch(`${this.baseURL}?path=${encodeURIComponent(path)}`);
    return await res.json();
  }

  // 📁 2. Crear carpeta
  async createFolder(path) {
    const res = await fetch(`${this.baseURL}/create-folder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    return await res.json();
  }

  // ⬆️ 3. Subir archivo
  async uploadFile(file, path = '') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const res = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      body: formData
    });
    return await res.json();
  }

  // ⬇️ 4. Descargar archivo
  async downloadFile(path) {
    const res = await fetch(`${this.baseURL}/download?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error('Error al descargar');
    return await res.blob();
  }

  // ❌ 5. Eliminar archivo o carpeta
  async deletePath(path) {
    const res = await fetch(`${this.baseURL}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    return await res.json();
  }

  // ✏️ 6. Renombrar archivo o carpeta
  async renamePath(oldPath, newName) {
    const res = await fetch(`${this.baseURL}/rename`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPath, newName })
    });
    return await res.json();
  }
}

export default FileService;