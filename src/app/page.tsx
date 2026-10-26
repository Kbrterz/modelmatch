'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ModelMenu from '@/components/ModelMenu';

interface RecommendationResult {
  category: string;
  difficulty: number;
  risk: string;
  recommended_model: string | null;
  reason: string;
  confidence: number;
  cheaper_alternative?: string | null;
  stronger_alternative?: string | null;
}

const NA = 'Not available yet';

export default function HomePage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Enter a question before continuing.');
      return;
    }
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || data.error || 'Something went wrong.');
      else setResult(data);
    } catch {
      setError('Network or server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const show = (value: string | number | null | undefined) =>
    value === null || value === undefined || value === '' ? null : String(value);

  return (
    <div className="space-y-10">
      <div className="hero-enter">
        <p className="mono-label mb-4 text-[10px] uppercase text-[#b56c4c]">Start with the work</p>
        <h1 className="serif-display text-[clamp(2.8rem,6vw,5.25rem)] leading-[0.98] tracking-[-0.05em] text-[#203c39]">
          Start with the task.
        </h1>
        <p className="mt-4 max-w-[570px] text-[15px] leading-[1.75] text-[#54645d] sm:text-[17px]">
          Tell us what you need to do. ModelMatch weighs the fit and recommends an AI model, with the reason.
        </p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <form className="question-panel hero-enter-delay" onSubmit={handleSubmit} noValidate>
          <div className="mb-6 flex items-center justify-between gap-4">
            <label htmlFor="task-question" className="mono-label text-[10px] uppercase text-[#6c766c]">Your question</label>
            <span className="mono-label rounded-full bg-[#e9e4d7] px-2.5 py-1.5 text-[9px] uppercase text-[#8b7965]">Required</span>
          </div>
          <textarea
            id="task-question"
            name="question"
            required
            value={question}
            onChange={(e) => { setQuestion(e.target.value); if (error) setError(''); }}
            maxLength={2000}
            rows={7}
            placeholder="What are you trying to make, solve, or understand?"
            aria-describedby="question-help question-count"
            aria-invalid={Boolean(error)}
            className="question-input w-full resize-y rounded-xl border border-[#d4cdbd] bg-[#fbf9f3] px-4 py-4 text-[15px] leading-[1.7] text-[#203c39] placeholder:text-[#7d8178] sm:px-5"
          />
          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <p id="question-help" className="max-w-[340px] text-[12px] leading-[1.65] text-[#6c736b]">
              Include the outcome you want and any constraints that matter. Do not enter personal or customer data.
            </p>
            <p id="question-count" className="mono-label whitespace-nowrap text-[10px] text-[#6c736b]" aria-live="polite">
              {question.length.toLocaleString()} / 2,000
            </p>
          </div>
          {error && (
            <p className="mt-3 text-[13px] text-[#a44737]" role="alert">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="recommend-button mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg px-5 py-3 text-[14px] font-semibold tracking-[-0.01em] sm:w-auto"
          >
            <span>{loading ? 'Analyzing...' : 'Recommend a model'}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <section className="result-panel hero-enter-delay" aria-labelledby="result-heading">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#ddd6c6] pb-5">
            <div>
              <p className="mono-label mb-2 text-[9px] uppercase text-[#b56c4c]">A considered recommendation</p>
              <h2 id="result-heading" className="serif-display text-[30px] leading-tight tracking-[-0.04em] text-[#203c39]">Your result</h2>
            </div>
            <span className="mono-label rounded-full border border-[#d7d0c0] px-2.5 py-1.5 text-[9px] uppercase text-[#6c6e63]">
              {result ? 'Ready' : loading ? 'Working' : 'Waiting'}
            </span>
          </div>

          {!result && (
            <p className="my-5 rounded-xl border border-dashed border-[#cfc7b6] bg-[#f7f3e9] px-4 py-4 text-[13px] leading-[1.65] text-[#68756c]" role="status" aria-live="polite">
              {loading ? 'Analyzing your question...' : 'No recommendation yet. Submit a question to see a transparent breakdown here.'}
            </p>
          )}

          <dl className="result-fields">
            <div className="result-field">
              <dt>Category</dt>
              <dd className={result ? 'capitalize' : 'muted'}>{show(result?.category)?.replace(/_/g, ' ') ?? NA}</dd>
            </div>
            <div className="result-field">
              <dt>Difficulty</dt>
              <dd className="flex items-center gap-3">
                <span className={result ? '' : 'muted'}>{result ? `${result.difficulty} / 5` : NA}</span>
                <span className="difficulty-scale" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((n) => <i key={n} className={result && n <= result.difficulty ? 'on' : ''} />)}
                </span>
              </dd>
            </div>
            <div className="result-field">
              <dt>Risk level</dt>
              <dd className={result ? (result.risk === 'High' ? 'font-semibold text-[#a44737]' : '') : 'muted'}>{show(result?.risk) ?? NA}</dd>
            </div>
            <div className="result-field result-field-featured">
              <dt>Recommended model</dt>
              <dd className={result?.recommended_model ? '' : 'muted'} style={result?.recommended_model ? undefined : { fontFamily: 'inherit', fontSize: 12, letterSpacing: 0 }}>
                {show(result?.recommended_model) ?? (result ? 'No routing rule is configured for this case yet.' : NA)}
              </dd>
            </div>
            <div className="result-field result-field-wide">
              <dt>Reason</dt>
              <dd className={result ? '' : 'muted'}>{show(result?.reason) ?? NA}</dd>
            </div>
            <div className="result-field">
              <dt>Confidence</dt>
              <dd className={result ? '' : 'muted'}>{result ? `${(result.confidence * 100).toFixed(1)}%` : NA}</dd>
            </div>
            <div className="result-field result-field-wide">
              <dt>One cheaper alternative</dt>
              <dd className={result?.cheaper_alternative ? '' : 'muted'}>{show(result?.cheaper_alternative) ?? (result ? 'None for this case' : NA)}</dd>
            </div>
            <div className="result-field result-field-wide">
              <dt>One stronger alternative</dt>
              <dd className={result?.stronger_alternative ? '' : 'muted'}>{show(result?.stronger_alternative) ?? (result ? 'None for this case' : NA)}</dd>
            </div>
          </dl>
          <p className="mt-5 border-t border-[#ddd6c6] pt-4 text-[11px] leading-[1.65] text-[#6c736b]">
            Values appear only when a recommendation can be made. A high-risk topic always routes to the strongest option: verify with a professional.
          </p>
        </section>
      </div>

      <ModelMenu />
    </div>
  );
}
