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
      {loading ? <p className="text-sm text-[#6c736b]">Loading history...</p> : history.length === 0 ? <p className="text-sm text-[#6c736b]">No past requests found.</p> : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="question-panel flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex gap-2 items-center"><span className="px-2 py-0.5 bg-[#e9e4d7] text-[#244944] text-xs font-semibold rounded uppercase">{item.category}</span><span className="text-xs text-[#6c736b]">{new Date(item.created_at).toLocaleString()}</span></div>
                {item.question_text && <p className="text-sm text-[#203c39] font-medium">{item.question_text}</p>}
                <p className="text-xs text-[#6c736b]">Recommended Model: <strong className="text-[#203c39]">{item.chosen_model}</strong> (Difficulty: {item.difficulty}/5)</p>
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 text-xs font-medium border border-red-200 px-2 py-1 rounded">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
