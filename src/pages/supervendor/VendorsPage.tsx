import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase/client';
import { Profile } from '../../types';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';
import { Building, Mail, Calendar } from 'lucide-react';

const VendorsPage = () => {
  const [vendors, setVendors] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'sub_vendor')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch vendors.');
    } else {
      setVendors(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Spinner size={48} /></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-8">Manage Sub Vendors</h1>
      <div className="bg-surface border border-border rounded-lg">
        <div className="grid grid-cols-4 gap-4 p-4 font-semibold text-textSecondary border-b border-border">
          <div>Vendor Name</div>
          <div>Email</div>
          <div>Date Joined</div>
        </div>
        {vendors.map((vendor) => (
          <div key={vendor.id} className="grid grid-cols-4 gap-4 p-4 items-center border-b border-border last:border-b-0">
            <div className="font-medium text-text flex items-center gap-2"><Building size={16} /> {vendor.name}</div>
            <div className="flex items-center gap-2"><Mail size={16} /> {vendor.email}</div>
            <div className="flex items-center gap-2"><Calendar size={16} /> {new Date(vendor.created_at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorsPage;
