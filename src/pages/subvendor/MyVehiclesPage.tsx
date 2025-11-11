import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { Vehicle } from '../../types';
import toast from 'react-hot-toast';
import { Plus, Car, Edit, Trash2, Hash, Users as CapacityIcon } from 'lucide-react';

import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/EmptyState';

const MyVehiclesPage = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');

  const fetchVehicles = useCallback(async () => {
    if (!user) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vehicles:', error);
        toast.error(`Failed to fetch vehicles: ${error.message}`);
        setVehicles([]);
      } else {
        setVehicles(data || []);
      }
    } catch (err) {
      console.error('Exception in fetchVehicles:', err);
      toast.error('An error occurred while fetching vehicles');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const resetForm = () => {
    setVehicleNumber('');
    setModel('');
    setCapacity('');
    setEditingVehicle(null);
  };

  const openModalForCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openModalForEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleNumber(vehicle.vehicle_number);
    setModel(vehicle.model);
    setCapacity(String(vehicle.capacity));
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

    const vehicleData = {
      vendor_id: user.id,
      vehicle_number: vehicleNumber,
      model,
      capacity: parseInt(capacity, 10),
    };

    let error;
    if (editingVehicle) {
      const { error: updateError } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', editingVehicle.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('vehicles').insert(vehicleData);
      error = insertError;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Vehicle ${editingVehicle ? 'updated' : 'added'} successfully!`);
      closeModal();
      fetchVehicles();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Vehicle deleted successfully.');
        fetchVehicles();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text">My Vehicles</h1>
        <Button onClick={openModalForCreate} leftIcon={<Plus size={16} />}>
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState
          icon={<Car size={48} />}
          title="No vehicles found"
          description="Get started by adding your first vehicle to your fleet."
          buttonText="Add First Vehicle"
          onButtonClick={openModalForCreate}
        />
      ) : (
        <div className="bg-surface border border-border rounded-lg">
          <div className="grid grid-cols-5 gap-4 p-4 font-semibold text-textSecondary border-b border-border">
            <div>Vehicle Number</div>
            <div>Model</div>
            <div>Capacity</div>
            <div>Date Added</div>
            <div className="text-right">Actions</div>
          </div>
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="grid grid-cols-5 gap-4 p-4 items-center border-b border-border last:border-b-0 hover:bg-neutral-700/20 transition-colors">
              <div className="font-medium text-text">{vehicle.vehicle_number}</div>
              <div>{vehicle.model}</div>
              <div>{vehicle.capacity}</div>
              <div>{new Date(vehicle.created_at).toLocaleDateString()}</div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => openModalForEdit(vehicle)}><Edit size={16} /></Button>
                <Button variant="danger" onClick={() => handleDelete(vehicle.id)}><Trash2 size={16} /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            icon={<Hash size={16} />}
            type="text"
            placeholder="Vehicle Number (e.g., MH12AB1234)"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            required
          />
          <Input
            icon={<Car size={16} />}
            type="text"
            placeholder="Model (e.g., Toyota Innova)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
          <Input
            icon={<CapacityIcon size={16} />}
            type="number"
            placeholder="Capacity (e.g., 7)"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Vehicle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyVehiclesPage;
