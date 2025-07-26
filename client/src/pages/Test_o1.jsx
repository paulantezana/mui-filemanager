import React, { createContext, useContext, useState } from 'react';
import ReactDOM from 'react-dom/client';

// -------- CONTEXTO --------
const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState({ name: 'Juan Pérez' });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  return useContext(UserContext);
}

// -------- COMPONENTES --------

function Navbar({ company, setCompany }) {
  // company={company} setCompany={setCompany}
  console.log('Navbar');
  // const { user } = useUser();

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
  const { user } = useUser();

  return (
    <aside style={{ width: '200px', background: '#f4f4f4', padding: '1rem' }}>
      Menú de {user.name}
    </aside>
  );
}

function Profile() {
  console.log('Profile');
  const { user, setUser } = useUser();

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
  const [company, setCompany] = useState({ name: 'FACEBOO' });
  return (
    <UserProvider>
      <Navbar company={company} setCompany={setCompany} />
      <Dashboard />
    </UserProvider>
  );
}

export default Test;