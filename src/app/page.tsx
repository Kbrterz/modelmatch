'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface RecommendationResult {
  category: string;
  difficulty: number;
  risk: string;
  recommended_model: string;
  reason: string;
  confidence: number;
  cheaper_alternative?: string;
  stronger_alternative?: string;
}

export default function HomePage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Please sign in to use ModelMatch.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || data.error || 'Something went wrong.');
      else setResult(data);
    } catch (err) {
      setError('Network or server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 text-sm text-amber-700">
        <strong>Privacy Notice:</strong> Do not enter personal or customer data into the prompt box.
      </div>
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-bold mb-4">Find the Best AI Model</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea rows={4} maxLength={2000} required value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Type your question or task description here..." className="w-full p-3 border rounded-lg text-sm" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{question.length}/2000 chars</span>
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Analyzing...' : 'Recommend Model'}
            </button>
          </div>
        </form>
        {error && <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
      </div>
      {result && (
        <div className="bg-white p-6 rounded-lg shadow border space-y-4">
          <h3 className="text-lg font-bold text-indigo-600">Recommendation Result</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded"><span className="block text-gray-500 text-xs">Category</span><span className="font-semibold capitalize">{result.category}</span></div>
            <div className="bg-gray-50 p-3 rounded"><span className="block text-gray-500 text-xs">Difficulty</span><span className="font-semibold">{result.difficulty}/5</span></div>
            <div className="bg-gray-50 p-3 rounded"><span className="block text-gray-500 text-xs">Risk Level</span><span className={`font-semibold ${result.risk === 'High' ? 'text-red-600' : 'text-green-600'}`}>{result.risk}</span></div>
            <div className="bg-gray-50 p-3 rounded"><span className="block text-gray-500 text-xs">Confidence</span><span className="font-semibold">{(result.confidence * 100).toFixed(1)}%</span></div>
          </div>
          <div className="border-t pt-4"><span className="block text-sm font-medium text-gray-500">Recommended Model</span><span className="text-xl font-bold text-indigo-700">{result.recommended_model}</span></div>
          <div><span className="block text-sm font-medium text-gray-500">Reasoning</span><p className="text-sm text-gray-700 mt-1">{result.reason}</p></div>
        </div>
      )}
    </div>
  );
}
