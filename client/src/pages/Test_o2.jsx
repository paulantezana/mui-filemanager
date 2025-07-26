import { createContext, useContext, useReducer } from 'react';

// -------- CONTEXTOS --------
const AppStateContext = createContext(null);
const AppDispatchContext = createContext(null);

// -------- ESTADO INICIAL Y REDUCER --------
const initialState = {
  user: { name: 'Juan Pérez' },
  company: { name: 'FACEBOO' },
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_COMPANY':
      return { ...state, company: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// -------- PROVIDER --------
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// -------- HOOKS PERSONALIZADOS --------
function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
}

// -------- COMPONENTES --------

function Navbar() {
  // console.log('Navbar');
  console.log('Navbar');

  const { company } = useAppState();
  const dispatch = useAppDispatch();

  const handleChange = (e) => {
    dispatch({ type: 'SET_COMPANY', payload: { name: e.target.value } });
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
  // console.log('Sidebar');
  console.log('Sidebar');

  const { user } = useAppState();

  return (
    <aside style={{ width: '200px', background: '#f4f4f4', padding: '1rem' }}>
      Menú de {user.name}
    </aside>
  );
}

function Profile() {
  // console.log('Profile');
  console.log('Profile');

  const { user } = useAppState();
  const dispatch = useAppDispatch();

  const handleChange = (e) => {
    dispatch({ type: 'SET_USER', payload: { name: e.target.value } });
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
  // console.log('Dashboard');
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
    <AppProvider>
      <Navbar />
      <Dashboard />
    </AppProvider>
  );
}

export default Test;
