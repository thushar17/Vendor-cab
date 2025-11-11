import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase/client';
import { Vehicle } from '../../types';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';

const AllVehiclesPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch vehicles.');
    } else {
      setVehicles(data as any[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Spinner size={48} /></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-8">All Vehicles</h1>
      <div className="bg-surface border border-border rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-4 font-semibold text-textSecondary border-b border-border">
          <div>Vehicle Number</div>
          <div>Model</div>
          <div>Capacity</div>
          <div>Vendor</div>
          <div>Date Added</div>
        </div>
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="grid grid-cols-5 gap-4 p-4 items-center border-b border-border last:border-b-0">
            <div className="font-medium text-text">{vehicle.vehicle_number}</div>
            <div>{vehicle.model}</div>
            <div>{vehicle.capacity}</div>
            <div className="text-textSecondary">{vehicle.profiles?.name}</div>
            <div>{new Date(vehicle.created_at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllVehiclesPage;
