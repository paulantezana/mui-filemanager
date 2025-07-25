import { useState } from "react";
import { Button } from "@mui/material";
import ManagerClient from "./ManagerClient";
import ManagerServer from "./ManagerServer";
import ManagerCustom from "./ManagerCustom";

const Home = () => {
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [serverModalOpen, setServerModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);

  return (<div>
    <Button onClick={() => setClientModalOpen(true)}>Client</Button>
    <Button onClick={() => setServerModalOpen(true)}>Server</Button>
    <Button onClick={() => setCustomModalOpen(true)}>Custom</Button>
    {clientModalOpen && <ManagerClient onClose={() => setClientModalOpen(false)} />}
    {serverModalOpen && <ManagerServer onClose={() => setServerModalOpen(false)} />}
    {customModalOpen && <ManagerCustom onClose={() => setCustomModalOpen(false)} />}
  </div>);
}

export default Home;