export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'super_vendor' | 'sub_vendor';
}

export interface Vehicle {
  id: string;
  vendor_id: string;
  vehicle_number: string;
  model: string;
  capacity: number;
  created_at: string;
  profiles?: { name: string }; // For super_vendor view
}

export interface Driver {
  id: string;
  vendor_id: string;
  driver_name: string;
  license_number: string;
  assigned_vehicle: string | null;
  created_at: string;
  profiles?: { name: string }; // For super_vendor view
  vehicles?: { vehicle_number: string } | null; // For super_vendor view
}
