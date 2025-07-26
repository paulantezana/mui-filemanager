import Breadcrumb from "../components/Breadcrumb";
import PanelBody from "../components/Main/PanelBody";
import Toolbar from "../components/Toolbar/Toolbar";

const LeftPanel = () => {
  return (
    <div style={{ paddingRight: '.5rem' }}>
      <div>
        <Toolbar />
        <Breadcrumb />
      </div>
      <div style={{ overflow: 'auto' }}>
        <PanelBody />
      </div>
    </div>);
}

export default LeftPanel;
