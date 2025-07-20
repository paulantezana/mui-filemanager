const matchPattern = (name, pattern) => {
  const hasWildcards = pattern.includes('*') || pattern.includes('?');
  if (hasWildcards) {
    let regexPattern = pattern
      .replace(/\./g, '\\.')  // Escapar puntos
      .replace(/\*/g, '.*')   // * se convierte en .*
      .replace(/\?/g, '.');   // ? se convierte en .
    regexPattern = `^${regexPattern}$`;
    const regex = new RegExp(regexPattern, 'i');
    return regex.test(name);
  } else {
    return name.toLowerCase().includes(pattern.toLowerCase());
  }
};

const searchFiles = (folder, term) => {
  let results = [];
  folder.forEach(item => {
    if (item.type === 'file' && matchPattern(item.name, term)) {
      results.push(item);
    } else if (item.type === 'folder') {
      results = [...results, ...searchFiles(item.children, term)];
    }
  });

  return results;
};

export default searchFiles;