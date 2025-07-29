import { createContext, useContext, useState } from "react";

const ItemSelectionValueContext = createContext(null);

export const ItemSelectionProvider = ({ children }) => {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  return (
    <ItemSelectionValueContext.Provider value={{ rowSelectionModel, setRowSelectionModel }}>
      {children}
    </ItemSelectionValueContext.Provider>
  );
};

export const useItemSelectedContext = () => useContext(ItemSelectionValueContext);
