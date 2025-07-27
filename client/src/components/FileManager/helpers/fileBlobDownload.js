const fileBlobDownload = (blob, name) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name || 'archivo';
  a.click();
  URL.revokeObjectURL(url);
}

export default fileBlobDownload;
