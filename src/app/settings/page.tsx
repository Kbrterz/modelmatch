'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SettingsPage() {
  const [language, setLanguage] = useState('EN');
  const [preference, setPreference] = useState('best_quality');
  const [doNotStore, setDoNotStore] = useState(false);
  const [threshold, setThreshold] = useState(0.75);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase.from('settings').select('*').eq('user_id', session.user.id).single();
      if (data && !error) {
        setLanguage(data.language);
        setPreference(data.preference);
        setDoNotStore(data.do_not_store_question);
        setThreshold(data.confidence_threshold);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { error } = await supabase.from('settings').update({
      language,
      preference,
      do_not_store_question: doNotStore,
      confidence_threshold: threshold,
      updated_at: new Date().toISOString()
    }).eq('user_id', session.user.id);
    if (error) setMessage('Failed to save settings.');
    else setMessage('Settings saved successfully!');
  };

  return (
    <div className="max-w-xl mx-auto question-panel">
      <h2 className="text-2xl font-bold mb-4">User Settings</h2>
      {message && <div className="mb-4 p-3 bg-[#e9efe6] text-[#244944] text-sm rounded">{message}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#203c39]">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="field-input">
            <option value="EN">English</option>
            <option value="TR">Türkçe</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#203c39]">Routing Preference</label>
          <select value={preference} onChange={(e) => setPreference(e.target.value)} className="field-input">
            <option value="best_quality">Best Quality</option>
            <option value="cheaper">Prefer Cheaper</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#203c39]">Confidence Threshold ({threshold})</label>
          <input type="range" min="0.5" max="0.95" step="0.05" value={threshold} onChange={(e) => setThreshold(parseFloat(e.target.value))} className="w-full mt-1" />
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="doNotStore" checked={doNotStore} onChange={(e) => setDoNotStore(e.target.checked)} className="rounded border-[#d4cdbd]" />
          <label htmlFor="doNotStore" className="text-sm font-medium text-[#203c39]">Do not store my question text</label>
        </div>
        <button type="submit" className="w-full recommend-button rounded-lg p-2.5 font-semibold">Save Changes</button>
      </form>
    </div>
  );
}
