import React, { createContext, memo, useContext, useState } from 'react';
import ReactDOM from 'react-dom/client';

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
      NAVVVVVVVVVVVVVV
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
  return (
    <main style={{ flex: 1, padding: '1rem' }}>
      <h2>Contenido principal</h2>
      <Profile />
    </main>
  );
}

const Greeting = memo(function Greeting({ name }) {
  return <h1>Greeting, {name}!</h1>;
});

function Dashboard() {
  console.log('Dashboard');
  const [name, setName] = useState('PAUL');

  return (
    <div style={{ display: 'flex', marginTop: '1rem' }}>
      <Sidebar />
      <MainContent />
      <Greeting name={name} />
    </div>
  );
}

// -------- APP --------
function Test() {
  return (
    <AppProvider>
      <Navbar />
      <Dashboard />
    </AppProvider>
  );
}

export default Test;
