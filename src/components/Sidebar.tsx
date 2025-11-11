import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, Car, UserCheck, Building } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const isSuperVendor = user?.profile?.role === 'super_vendor';

  const commonLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/vehicles', icon: Car, label: 'My Vehicles' },
    { to: '/dashboard/drivers', icon: UserCheck, label: 'My Drivers' },
  ];

  const superVendorLinks = [
    { to: '/super-vendor', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/super-vendor/vendors', icon: Building, label: 'Sub Vendors' },
    { to: '/super-vendor/vehicles', icon: Car, label: 'All Vehicles' },
    { to: '/super-vendor/drivers', icon: Users, label: 'All Drivers' },
  ];

  const links = isSuperVendor ? superVendorLinks : commonLinks;
  const base = isSuperVendor ? '/super-vendor' : '/dashboard';

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-border">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Car size={28} />
          <span>VendorFlow</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === base || link.to === '/super-vendor'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 my-1 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary/20 text-primary'
                      : 'text-textSecondary hover:bg-neutral-700/50 hover:text-text'
                  }`
                }
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
