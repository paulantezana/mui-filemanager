function formatFileSize(bytes) {
  if ([null, undefined].includes(bytes)) return '';
  if (bytes === 0) return '0 bytes';
 
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);

  return `${size.toFixed(2)} ${units[i]}`;
}

export default formatFileSize;