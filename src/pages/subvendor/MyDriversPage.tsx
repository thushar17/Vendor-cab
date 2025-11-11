import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { Driver, Vehicle } from '../../types';
import toast from 'react-hot-toast';
import { Plus, UserCheck, Edit, Trash2, User as UserIcon, Fingerprint, Car } from 'lucide-react';

import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/EmptyState';

const MyDriversPage = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [driverName, setDriverName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [assignedVehicle, setAssignedVehicle] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setDrivers([]);
      setVehicles([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const [driversRes, vehiclesRes] = await Promise.all([
        supabase.from('drivers').select('*, vehicles(vehicle_number)').eq('vendor_id', user.id).order('created_at', { ascending: false }),
        supabase.from('vehicles').select('id, vehicle_number').eq('vendor_id', user.id)
      ]);

      if (driversRes.error) {
        console.error('Error fetching drivers:', driversRes.error);
        toast.error('Failed to fetch drivers.');
        setDrivers([]);
      } else {
        setDrivers(driversRes.data as any[]);
      }

      if (vehiclesRes.error) {
        console.error('Error fetching vehicles:', vehiclesRes.error);
        toast.error('Failed to fetch vehicles.');
        setVehicles([]);
      } else {
        setVehicles(vehiclesRes.data as any);
      }
    } catch (err) {
      console.error('Error in fetchData:', err);
      toast.error('An error occurred while fetching data');
      setDrivers([]);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setDriverName('');
    setLicenseNumber('');
    setAssignedVehicle(null);
    setEditingDriver(null);
  };

  const openModalForCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openModalForEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setDriverName(driver.driver_name);
    setLicenseNumber(driver.license_number);
    setAssignedVehicle(driver.assigned_vehicle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const driverData = {
      vendor_id: user.id,
      driver_name: driverName,
      license_number: licenseNumber,
      assigned_vehicle: assignedVehicle === '' ? null : assignedVehicle,
    };

    let error;
    if (editingDriver) {
      const { error: updateError } = await supabase.from('drivers').update(driverData).eq('id', editingDriver.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('drivers').insert(driverData);
      error = insertError;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Driver ${editingDriver ? 'updated' : 'added'} successfully!`);
      closeModal();
      fetchData();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (driverId: string) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      const { error } = await supabase.from('drivers').delete().eq('id', driverId);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Driver deleted successfully.');
        fetchData();
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Spinner size={48} /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text">My Drivers</h1>
        <Button onClick={openModalForCreate} leftIcon={<Plus size={16} />}>Add Driver</Button>
      </div>

      {drivers.length === 0 ? (
        <EmptyState
          icon={<UserCheck size={48} />}
          title="No drivers found"
          description="Get started by adding your first driver to your team."
          buttonText="Add First Driver"
          onButtonClick={openModalForCreate}
        />
      ) : (
        <div className="bg-surface border border-border rounded-lg">
          <div className="grid grid-cols-5 gap-4 p-4 font-semibold text-textSecondary border-b border-border">
            <div>Driver Name</div>
            <div>License Number</div>
            <div>Assigned Vehicle</div>
            <div>Date Added</div>
            <div className="text-right">Actions</div>
          </div>
          {drivers.map((driver) => (
            <div key={driver.id} className="grid grid-cols-5 gap-4 p-4 items-center border-b border-border last:border-b-0 hover:bg-neutral-700/20 transition-colors">
              <div className="font-medium text-text">{driver.driver_name}</div>
              <div>{driver.license_number}</div>
              <div>{driver.vehicles?.vehicle_number || <span className="text-textSecondary">Unassigned</span>}</div>
              <div>{new Date(driver.created_at).toLocaleDateString()}</div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => openModalForEdit(driver)}><Edit size={16} /></Button>
                <Button variant="danger" onClick={() => handleDelete(driver.id)}><Trash2 size={16} /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingDriver ? 'Edit Driver' : 'Add New Driver'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input icon={<UserIcon size={16} />} type="text" placeholder="Driver's Full Name" value={driverName} onChange={(e) => setDriverName(e.target.value)} required />
          <Input icon={<Fingerprint size={16} />} type="text" placeholder="License Number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} required />
          <div className="relative">
            <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={16} />
            <select
              value={assignedVehicle || ''}
              onChange={(e) => setAssignedVehicle(e.target.value)}
              className="w-full bg-neutral-800/50 border border-border rounded-md py-2 pl-10 pr-4 text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="">Unassigned</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicle_number}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Driver'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyDriversPage;
