-- ModelMatch starter routing rules, built from the four tiers in src/lib/modelTiers.ts.
-- NOT applied automatically: run it once in the Supabase SQL editor after the initial migration.
-- Each tier uses ONE default model; change any row later without touching code. Model names are display names,
-- not API ids, and the tier order is by price only (task quality has not been measured yet).
-- Difficulty bands: 1-2 fast, 3 balanced, 4 strong, 5 strong (stronger alternative = top tier).
-- High-stakes questions and low-confidence answers use stronger_alternative, as set in the n8n workflow.
-- Default per tier: fast = Claude Haiku 5.5, balanced = GPT-5 mini, strong = Claude Sonnet 5.5, top = Claude Fable 5.1.

insert into public.routing_rules
  (category, difficulty_min, difficulty_max, model, cheaper_alternative, stronger_alternative, reason)
select c.category, b.dmin, b.dmax, b.model, b.cheaper, b.stronger, b.reason
from (values
  ('coding'), ('data_analysis'), ('long_document_reasoning'), ('writing_editing'), ('translation'),
  ('quick_factual_lookup'), ('math'), ('image_understanding'), ('other')
) as c(category)
cross join (values
  (1, 2, 'Claude Haiku 5.5',  null,                'GPT-5 mini',        'Easy task: a fast, low-cost model is enough.'),
  (3, 3, 'GPT-5 mini',        'Claude Haiku 5.5',  'Claude Sonnet 5.5', 'Medium task: a balanced model fits.'),
  (4, 4, 'Claude Sonnet 5.5', 'GPT-5 mini',        'Claude Fable 5.1',  'Hard task: a strong model reduces errors.'),
  (5, 5, 'Claude Sonnet 5.5', 'GPT-5 mini',        'Claude Fable 5.1',  'Very hard task: strong model, with the top tier as the stronger option.')
) as b(dmin, dmax, model, cheaper, stronger, reason);
