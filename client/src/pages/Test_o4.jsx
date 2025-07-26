import { createContext, memo, useContext, useState } from 'react';
import ModalProvider, { useModal } from './Modal/ModalProvider';


// -------- CONTEXTO --------
const AppContext = createContext(null);

function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'Juan Pérez' });
  const [company, setCompany] = useState({ name: 'FACEBOO' });

  return (
    <AppContext.Provider value={{ user, setUser, company, setCompany }}>
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de <AppProvider>');
  }
  return context;
}

// -------- COMPONENTES --------

function Navbar() {
  // company={company} setCompany={setCompany}
  console.log('Navbar');

  const { company, setCompany } = useAppContext();

  const handleChange = (e) => {
    setCompany({ name: e.target.value });
  };

  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      {/* Bienvenido, {user.name} */}
      <input
        type="text"
        value={company.name}
        onChange={handleChange}
        style={{ padding: '0.5rem', marginTop: '0.5rem' }}
      />
    </nav>
  );
}

function Sidebar() {
  console.log('Sidebar');
  const { user } = useAppContext();

  return (
    <aside style={{ width: '200px', background: '#f4f4f4', padding: '1rem' }}>
      Menú de {user.name}
    </aside>
  );
}

function Profile() {
  console.log('Profile');
  const { user, setUser } = useAppContext();

  const handleChange = (e) => {
    setUser({ name: e.target.value });
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Perfil del usuario</h3>
      <p>Nombre actual: {user.name}</p>
      <input
        type="text"
        value={user.name}
        onChange={handleChange}
        style={{ padding: '0.5rem', marginTop: '0.5rem' }}
      />
    </div>
  );
}

function MainContent() {
  const [name, setName] = useState('PAUL');

  return (
    <main style={{ flex: 1, padding: '1rem' }}>
      <h2>Contenido principal</h2>
      <Profile />
      <Greeting name={name} />
    </main>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting');
  const Modal = useModal();

  const openModal = () => {
    Modal.confirm({
      title: '¿Estás seguro?',
      description: 'Esta acción no se puede deshacer.',
      onClose: () => console.log('Modal cerrado'),
    });
  }
  return (<div>
    <div>Greeting, {name}! </div>
    <button onClick={openModal}>MODAL</button>
  </div>);
});

function Dashboard() {
  console.log('Dashboard');

  return (
    <div style={{ display: 'flex', marginTop: '1rem' }}>
      <Sidebar />
      <MainContent />
    </div>
  );
}

// -------- APP --------
function Test() {
  return (
    <ModalProvider>
      <AppProvider>
        <Navbar />
        <Dashboard />
      </AppProvider>
    </ModalProvider>
  );
}

export default Test;
