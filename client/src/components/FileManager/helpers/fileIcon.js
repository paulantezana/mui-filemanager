const getFileIcon = (fileType, name) => {
  const ext = fileType.toLowerCase() === 'folder' ? 'folder' : name.split('.').pop().toLowerCase();

  switch (ext) {
    case 'folder':
      return '📁';
    case 'pdf':
      return '📕';
    case 'doc':
    case 'docx':
      return '📄'; // Documento de Word
    case 'xls':
    case 'xlsx':
      return '📊'; // Excel
    case 'ppt':
    case 'pptx':
      return '📽️'; // PowerPoint
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      return '📜'; // Código JS/TS
    case 'html':
    case 'css':
      return '🌐'; // Web
    case 'json':
    case 'xml':
    case 'yaml':
      return '🗂️'; // Datos
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
    case 'svg':
      return '🖼️'; // Imagen
    case 'mp4':
    case 'mkv':
    case 'avi':
    case 'mov':
      return '🎞️'; // Video
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
      return '🎵'; // Audio
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return '🗜️'; // Comprimido
    case 'exe':
    case 'msi':
    case 'apk':
      return '💾'; // Ejecutable
    case 'txt':
      return '📄'; // Texto plano
    case 'file':
      return '📄';
    default:
      return '📦'; // Genérico
  }
};

export default getFileIcon;
