import VerticalSplitter from "../shared/components/VerticalSplitter";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import ViewerModal from "./ViewerModal";

const Manager = () => {
  return (
    <div className="h-full">
      <VerticalSplitter
        leftContent={<LeftPanel />}
        rightContent={<RightPanel />}
        initialLeftWidth={40}
        minLeftWidth={15}
        maxLeftWidth={85}
        splitterWidth={6}
      />
      <ViewerModal />
    </div>
  );
};

export default Manager;