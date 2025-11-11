import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Car, UserCheck, Link2 } from 'lucide-react';
import MyVehiclesPage from './subvendor/MyVehiclesPage';
import MyDriversPage from './subvendor/MyDriversPage';

const DashboardHome = () => {
    const { user } = useAuth();
    return (
        <div>
            <h1 className="text-3xl font-bold text-text">Welcome, {user?.profile?.name}!</h1>
            <p className="text-textSecondary mt-2">This is your Sub Vendor dashboard. Manage your vehicles and drivers here.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-surface p-6 rounded-lg border border-border">
                    <Car className="text-secondary" size={32} />
                    <h3 className="text-xl font-semibold mt-4">My Vehicles</h3>
                    <p className="text-textSecondary mt-1">Add, view, and manage your vehicle fleet.</p>
                </div>
                <div className="bg-surface p-6 rounded-lg border border-border">
                    <UserCheck className="text-accent" size={32} />
                    <h3 className="text-xl font-semibold mt-4">My Drivers</h3>
                    <p className="text-textSecondary mt-1">Onboard and manage your drivers.</p>
                </div>
                <div className="bg-surface p-6 rounded-lg border border-border">
                    <Link2 className="text-success" size={32} />
                    <h3 className="text-xl font-semibold mt-4">Assign Roles</h3>
                    <p className="text-textSecondary mt-1">Assign drivers to specific vehicles.</p>
                </div>
            </div>
        </div>
    );
};

const SubVendorDashboard = () => {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="vehicles" element={<MyVehiclesPage />} />
      <Route path="drivers" element={<MyDriversPage />} />
    </Routes>
  );
};

export default SubVendorDashboard;
