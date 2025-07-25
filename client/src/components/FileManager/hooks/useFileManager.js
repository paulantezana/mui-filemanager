import { useEffect, useState } from "react";

class ClientDataSourceManager {
  constructor(initialData = []) {
    this.treeData = initialData;
    this.isLoaded = false;
  }

  async loadData(dataSource, forceRefresh = false) {
    if (!this.isLoaded || forceRefresh) {
      let data;
      
      if (Array.isArray(dataSource)) {
        data = dataSource;
      } else if (typeof dataSource === 'function') {
        data = await dataSource();
      } else {
        data = [];
      }
      
      this.treeData = data ?? [];
      this.isLoaded = true;
    }
    
    return this.treeData;
  }

  getDataByPath(path) {
    const pathArray = path.split('/').filter(segment => 
      segment && segment.toUpperCase() !== 'INICIO'
    );

    if (pathArray.length === 0) {
      return this.treeData;
    }

    let currentLevel = this.treeData;
    
    for (const pathSegment of pathArray) {
      const found = currentLevel.find(item => 
        item.type === 'folder' && item.name === pathSegment
      );
      
      if (found && found.children) {
        currentLevel = found.children;
      } else {
        return [];
      }
    }
    
    return currentLevel;
  }

  reset() {
    this.isLoaded = false;
    this.treeData = [];
  }
}

const useFileManager = ({ operations, folderModel }) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [pathHistory, setPathHistory] = useState([{ name: 'Inicio', data: [] }]);
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(false);
  
  const [clientManager] = useState(() => new ClientDataSourceManager());

  useEffect(() => {
    const setNormalized = (data) => {
      setCurrentItems(data ?? []);
    }

    const setDataFunction = async (list) => {
      try {
        setLoading(true);
        setErrors(false);
        
        const path = '/' + pathHistory
          .filter(item => item.name.toUpperCase() !== 'INICIO')
          .map(item => item.name)
          .join('/');

        let files;

        if (folderModel === 'client') {
          await clientManager.loadData(list, refreshData !== clientManager.lastRefreshState);
          clientManager.lastRefreshState = refreshData;
          files = clientManager.getDataByPath(path);
          setDataSource(clientManager.treeData);
        } else {
          files = await list(path);
        }
        
        setNormalized(files);
      } catch (ex) {
        setErrors(ex.message);
      } finally {
        setLoading(false);
      }
    }

    if (Array.isArray(operations.list)) {
      if (folderModel === 'client') {
        clientManager.loadData(operations.list, true).then(() => {
          const path = '/' + pathHistory
            .filter(item => item.name.toUpperCase() !== 'INICIO')
            .map(item => item.name)
            .join('/');
          const files = clientManager.getDataByPath(path);
          setNormalized(files);
          setDataSource(clientManager.treeData);
        });
      } else {
        setNormalized(operations.list);
      }
    } else if (typeof operations.list === 'function') {
      setDataFunction(operations.list);
    }
  }, [operations.list, refreshData, pathHistory.length, folderModel]);

  const refresh = () => {
    if (folderModel === 'client') {
      // En modo cliente, resetear el manager para forzar recarga
      clientManager.reset();
    }
    setRefreshData(prev => !prev);
  };

  return {
    loading,
    errors,
    currentItems,
    pathHistory,
    dataSource,
    setCurrentItems,
    setPathHistory,
    refresh,
  }
}

export default useFileManager;