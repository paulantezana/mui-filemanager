import Breadcrumb from "./Breadcrumb";
import Search from "./Search";
import Toolbar from "./Toolbar/Toolbar";

const PanelHeader = ({ pathHistory, navigateToPath, handleSearch, searchTerm, currentItems, isSearching }) => {
  return (<div>
    <Toolbar />
    <div className="flex justify-between items-center">
      <Breadcrumb pathHistory={pathHistory} onNavigate={navigateToPath} />
      <Search onSearch={handleSearch} searchTerm={searchTerm} />
    </div>
    {isSearching && (
      <div style={{ padding: '8px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
        Mostrando resultados para: "{searchTerm}" ({currentItems.length} archivo(s) encontrado(s))
      </div>
    )}
  </div>
  );
}

export default PanelHeader;