import { useEffect, useState } from "react";

const useFileManager = ({ operations, folderModel }) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [pathHistory, setPathHistory] = useState([{ name: 'Inicio', data: [] }]);
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(false);

  useEffect(() => {
    const setNormalized = (data) => {
      setCurrentItems(data ?? []);
    }

    const setDataFunction = async (list) => {
      try {
        setLoading(true);
        const path = '/' + pathHistory.filter(item => item.name.toLocaleUpperCase() !== 'INICIO').map(item => item.name).join('/');
        const files = await list(path);
        setNormalized(files);
      } catch (ex) {
        setErrors(ex.message);
      } finally {
        setLoading(false);
      }
    }

    if (Array.isArray(operations.list)) {
      setNormalized(operations.list);
    }

    if (typeof operations.list === 'function') {
      setDataFunction(operations.list);
    }
  }, [operations.list, refreshData, pathHistory.length]);

  const refresh = () => {
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