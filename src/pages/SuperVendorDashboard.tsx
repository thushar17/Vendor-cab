import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building, Car, Users } from 'lucide-react';
import VendorsPage from './supervendor/VendorsPage';
import AllVehiclesPage from './supervendor/AllVehiclesPage';
import AllDriversPage from './supervendor/AllDriversPage';

const DashboardHome = () => {
    const { user } = useAuth();
    return (
        <div>
            <h1 className="text-3xl font-bold text-text">Welcome, {user?.profile?.name}!</h1>
            <p className="text-textSecondary mt-2">This is the Super Vendor dashboard. Manage everything from here.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-surface p-6 rounded-lg border border-border">
                    <Building className="text-primary" size={32} />
                    <h3 className="text-xl font-semibold mt-4">Manage Vendors</h3>
                    <p className="text-textSecondary mt-1">View and create sub-vendor accounts.</p>
                </div>
                <div className="bg-surface p-6 rounded-lg border border-border">
                    <Car className="text-secondary" size={32} />
                    <h3 className="text-xl font-semibold mt-4">Oversee Vehicles</h3>
                    <p className="text-textSecondary mt-1">Monitor the entire fleet across all vendors.</p>
                </div>
                <div className="bg-surface p-6 rounded-lg border border-border">
                    <Users className="text-accent" size={32} />
                    <h3 className="text-xl font-semibold mt-4">Track Drivers</h3>
                    <p className="text-textSecondary mt-1">Keep an eye on all registered drivers.</p>
                </div>
            </div>
        </div>
    );
};

const SuperVendorDashboard = () => {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="vendors" element={<VendorsPage />} />
      <Route path="vehicles" element={<AllVehiclesPage />} />
      <Route path="drivers" element={<AllDriversPage />} />
    </Routes>
  );
};

export default SuperVendorDashboard;
