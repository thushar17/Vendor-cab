import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import toast from 'react-hot-toast';
import { Car, User, Mail, Lock, Briefcase } from 'lucide-react';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'super_vendor' | 'sub_vendor'>('sub_vendor');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else if (user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        name,
        email,
        role,
      });

      if (profileError) {
        toast.error(profileError.message);
        // Consider deleting the auth user if profile creation fails
      } else {
        toast.success('Account created! Please check your email to verify.');
        navigate('/login');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mb-4">
            <Car className="text-primary" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-text">Create Your Account</h1>
          <p className="text-textSecondary mt-2">Join VendorFlow and streamline your operations.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6 bg-surface p-8 rounded-lg shadow-lg border border-border">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-neutral-800/50 border border-border rounded-md py-3 pl-12 pr-4 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-800/50 border border-border rounded-md py-3 pl-12 pr-4 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-neutral-800/50 border border-border rounded-md py-3 pl-12 pr-4 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'super_vendor' | 'sub_vendor')}
              required
              className="w-full bg-neutral-800/50 border border-border rounded-md py-3 pl-12 pr-4 text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="sub_vendor">Sub Vendor</option>
              <option value="super_vendor">Super Vendor</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-textSecondary mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
