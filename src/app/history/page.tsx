'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface RequestItem {
  id: string;
  category: string;
  difficulty: number;
  chosen_model: string;
  created_at: string;
  question_text?: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    const { data, error } = await supabase.from('requests').select('id, category, difficulty, chosen_model, created_at, question_text').eq('user_id', session.user.id).order('created_at', { ascending: false });
    if (!error && data) setHistory(data);
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('requests').delete().eq('id', id);
    if (!error) setHistory(history.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Request History</h2>
      {loading ? <p className="text-sm text-gray-500">Loading history...</p> : history.length === 0 ? <p className="text-sm text-gray-500">No past requests found.</p> : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex gap-2 items-center"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded uppercase">{item.category}</span><span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</span></div>
                {item.question_text && <p className="text-sm text-gray-800 font-medium">{item.question_text}</p>}
                <p className="text-xs text-gray-500">Recommended Model: <strong className="text-gray-800">{item.chosen_model}</strong> (Difficulty: {item.difficulty}/5)</p>
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 text-xs font-medium border border-red-200 px-2 py-1 rounded">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
