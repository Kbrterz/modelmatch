'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage('Registration successful! Check your email or sign in.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow border mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">{isSignUp ? 'Create Account' : 'Sign In'}</h2>
      {message && <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-sm rounded">{message}</div>}
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded font-medium hover:bg-indigo-700">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-indigo-600 hover:underline">
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
