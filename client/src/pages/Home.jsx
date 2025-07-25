import { useState } from "react";
import { Button } from "@mui/material";
import ManagerClient from "./ManagerClient";
import ManagerServer from "./ManagerServer";

const Home = () => {
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [serverModalOpen, setServerModalOpen] = useState(false);

  return (<div>
    <Button onClick={() => setClientModalOpen(true)}>Client</Button>
    <Button onClick={() => setServerModalOpen(true)}>Server</Button>
    {clientModalOpen && <ManagerClient onClose={() => setClientModalOpen(false)} />}
    {serverModalOpen && <ManagerServer onClose={() => setServerModalOpen(false)} />}
  </div>);
}

export default Home;