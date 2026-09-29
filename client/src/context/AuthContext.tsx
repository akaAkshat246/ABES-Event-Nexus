import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IAdmin, IStudent } from '../types';
import { getAdminProfileApi } from '../api/auth';

interface AuthContextType {
  admin: IAdmin | null;
  student: IStudent | null;
  token: string | null;
  isAuthenticated: boolean;
  isStudentAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, admin: IAdmin) => void;
  logout: () => void;
  studentLogin: (student: IStudent) => void;
  studentLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<IAdmin | null>(() => {
    const savedAdmin = localStorage.getItem('abes_admin_user');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
  const [student, setStudent] = useState<IStudent | null>(() => {
    const savedStudent = localStorage.getItem('abes_student_user');
    return savedStudent ? JSON.parse(savedStudent) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('abes_admin_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('abes_admin_token');
      if (savedToken) {
        try {
          const data = await getAdminProfileApi();
          if (data.success && data.admin) {
            setAdmin(data.admin);
            localStorage.setItem('abes_admin_user', JSON.stringify(data.admin));
          }
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = (newToken: string, newAdmin: IAdmin) => {
    setToken(newToken);
    setAdmin(newAdmin);
    localStorage.setItem('abes_admin_token', newToken);
    localStorage.setItem('abes_admin_user', JSON.stringify(newAdmin));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('abes_admin_token');
    localStorage.removeItem('abes_admin_user');
  };

  const studentLogin = (newStudent: IStudent) => {
    setStudent(newStudent);
    localStorage.setItem('abes_student_user', JSON.stringify(newStudent));
  };

  const studentLogout = () => {
    setStudent(null);
    localStorage.removeItem('abes_student_user');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        student,
        token,
        isAuthenticated: !!token && !!admin,
        isStudentAuthenticated: !!student,
        isLoading,
        login,
        logout,
        studentLogin,
        studentLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
