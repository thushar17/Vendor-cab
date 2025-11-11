import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="h-20 bg-surface border-b border-border flex items-center justify-end px-8">
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-text">{user?.profile?.name}</p>
          <p className="text-sm text-textSecondary">{user?.email}</p>
        </div>
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
          <UserIcon size={20} />
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-md text-textSecondary hover:bg-neutral-700/50 hover:text-text transition-colors"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
