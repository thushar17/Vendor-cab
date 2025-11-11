import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase/client';
import { Driver } from '../../types';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';

const AllDriversPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('drivers')
      .select('*, profiles(name), vehicles(vehicle_number)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch drivers.');
    } else {
      setDrivers(data as any[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Spinner size={48} /></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-8">All Drivers</h1>
      <div className="bg-surface border border-border rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-4 font-semibold text-textSecondary border-b border-border">
          <div>Driver Name</div>
          <div>License Number</div>
          <div>Assigned Vehicle</div>
          <div>Vendor</div>
          <div>Date Added</div>
        </div>
        {drivers.map((driver) => (
          <div key={driver.id} className="grid grid-cols-5 gap-4 p-4 items-center border-b border-border last:border-b-0">
            <div className="font-medium text-text">{driver.driver_name}</div>
            <div>{driver.license_number}</div>
            <div>{driver.vehicles?.vehicle_number || <span className="text-textSecondary">Unassigned</span>}</div>
            <div className="text-textSecondary">{driver.profiles?.name}</div>
            <div>{new Date(driver.created_at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDriversPage;
