'use client';

import { useState } from 'react';
import { MENU_TEXT, QUICK_GUIDE, TIERS, type Lang } from '@/lib/modelTiers';

export default function ModelMenu() {
  const [lang, setLang] = useState<Lang>('en');
  const text = MENU_TEXT[lang];

  return (
    <section aria-labelledby="model-menu-title" className="bg-white p-6 rounded-lg shadow border space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="model-menu-title" className="text-xl font-bold">{text.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{text.intro}</p>
        </div>
        <div className="flex border rounded overflow-hidden text-xs font-medium" role="group" aria-label="Language">
          {(['en', 'tr'] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`px-3 py-1 ${lang === l ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TIERS.map((tier) => (
          <div key={tier.id} className="border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">
              <span aria-hidden="true">{tier.icon} </span>
              {tier.label[lang]} <span className="text-gray-500 font-normal">({tier.price})</span>
            </h3>
            <p className="text-sm"><strong>{text.goodFor}:</strong> {tier.goodFor[lang]}</p>
            <p className="text-sm"><strong>{text.choose}:</strong> {tier.choose[lang]}</p>
            <p className="text-sm"><strong>{text.options}:</strong> {tier.models.join(' · ')}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-2">{text.guide}</h3>
        <ul className="text-sm space-y-1">
          {QUICK_GUIDE.map((row) => {
            const tier = TIERS.find((t) => t.id === row.tier)!;
            return (
              <li key={row.tier} className="flex justify-between gap-4 border-b py-1">
                <span>{row.question[lang]}</span>
                <span className="font-medium whitespace-nowrap"><span aria-hidden="true">{tier.icon} </span>{tier.label[lang]}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="text-sm text-gray-700">{text.unsure}</p>
      <p className="text-xs text-gray-500">{text.privacy}</p>
      <p className="text-xs text-gray-500">{text.note}</p>
    </section>
  );
}
