import { useAuth } from '../contexts/AuthContext';

export const useAuthHook = () => {
  return useAuth();
};

export default useAuthHook;