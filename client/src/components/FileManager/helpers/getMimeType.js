const getMimeType = (filename) => {
  const ext = filename?.toLowerCase().split('.').pop() ?? '';

  const mimeTypes = {
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    xml: 'application/xml',
    csv: 'text/csv',

    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    svg: 'image/svg+xml',

    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg',

    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    flac: 'audio/flac',

    pdf: 'application/pdf',
    zip: 'application/zip',
    rar: 'application/vnd.rar',
    tar: 'application/x-tar',
    '7z': 'application/x-7z-compressed',

    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  };

  return mimeTypes[ext] || 'application/octet-stream'; // valor por defecto
};

export default getMimeType;