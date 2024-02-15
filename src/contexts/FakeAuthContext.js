import { createContext } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
}

function useAuth() {
  const authCtx = useContext(AuthContext);

  if (!authCtx) throw new Error('AuthContext was used outside AuthProvider');

  return authCtx;
}

export { AuthProvider, useAuth };
