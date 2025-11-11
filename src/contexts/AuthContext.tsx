import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../supabase/client';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'super_vendor' | 'sub_vendor';
}

interface AuthUser extends User {
  profile?: Profile;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('getSession: session exists =', !!session);
        if (session) {
          // Add timeout to profile fetch
          const profilePromise = supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
          );

        try {
            const { data: profile, error } = await Promise.race([
              profilePromise,
              timeoutPromise,
            ]) as any;

            if (error) {
              console.error('Error fetching profile:', error.message, error.code);
              setUser(session.user);
            } else if (profile) {
              setUser({ ...session.user, profile });
            } else {
              console.warn('No profile found for user:', session.user.id);
              setUser(session.user);
            }
          } catch (timeoutError) {
            console.warn('Profile fetch timed out - proceeding without profile');
            setUser(session.user);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error in getSession:', error);
        setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('onAuthStateChange: event =', _event, 'has session =', !!session);
      try {
        if (session) {
          // Add timeout to profile fetch
          const profilePromise = supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
          );

          try {
            const { data: profile, error } = await Promise.race([
              profilePromise,
              timeoutPromise,
            ]) as any;

            if (error) {
              console.error('Error fetching profile:', error.message, error.code);
              setUser(session.user);
            } else if (profile) {
              setUser({ ...session.user, profile });
            } else {
              console.warn('No profile found for user:', session.user.id);
              setUser(session.user);
            }
          } catch (timeoutError) {
            console.warn('Profile fetch timed out - proceeding without profile');
            setUser(session.user);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error in onAuthStateChange:', error);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
