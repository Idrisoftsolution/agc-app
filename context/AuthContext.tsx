import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getUserByToken, googleLogin, googleRegister, logOff, register, signIn } from '../services/auth';
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  type: 'lawyer' | 'client';
  specialization?: string;
  barNumber?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  glogin: (tokenId: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  gsignup: (tokenId: string,role:string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Use Supabase directly for authentication
// import { getUserByToken } from '../services/user';





export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);




  useEffect(() => {
    async function fetchUser() {
      try {
        const storedUser = await getUserByToken();
        console.log(storedUser)

        if (storedUser) {
          setUser(storedUser.user);
          setToken(storedUser.token || null);
        } else {
          console.log('User not found in localStorage');
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false); // ✅ only after fetch finishes
      }
    }

    fetchUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      console.log('Attempting login for:', email);

      const account = await signIn(email, password)
      

      if (account && account.success) {


        setUser(account.user);
        setToken(account.accessToken || null);
        setIsLoading(false);
        return true;
      }




      console.error('Login failed - user not found or invalid credentials');
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };


  const glogin = async (tokenId: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // console.log('Attempting login for:', email);

      const account = await googleLogin(tokenId)
      if (account.success) {

        setUser(account?.user);
        setToken(account?.token || null);
      } 
      setIsLoading(false);
      return account;
      
    }
    catch (error) {
      console.error('Login error:', error.message);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, type: 'advocate' | 'client', specialization?: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      console.log('Attempting signup for:', email);


      // Create new user
      const newUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email,
        password, // In production, this should be hashed
        name,
        role: 'USER',
        type,
        specialization,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage


      // Auto-login after successful registration
      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        type: newUser.type,
        specialization: newUser.specialization
      };

      await register(type, email, specialization, "No bio", password, name, true)

      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userToken', `user-token-${userData.id}`);
      setUser(userData);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const gsignup = async (tokenId: string,role:string): Promise<boolean> => {
    setIsLoading(true);
    try{
      const account = await googleRegister(tokenId,role)
      console.log(account)
      if (account.success) {
        // console.log(account)
        setUser(account?.user);
        setToken(account?.token || null);
      }
      setIsLoading(false);
      return account;
    }
    catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };
  const logout = async () => {
    const status = await logOff()
    // console.log(status)
    // localStorage.removeItem('userData');
    // localStorage.removeItem('userToken');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isLoading,
    glogin,
    gsignup
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};